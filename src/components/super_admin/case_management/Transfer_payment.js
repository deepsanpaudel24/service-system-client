import React, {useState, useLayoutEffect, useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FinalPaymentTransferDispatcher } from "../../actions/case_management/FinalPaymentTransferAction";
import { PulseLoader } from "react-spinners";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const TransferPayment = (props) => {
    const {t, spname, spid, clientname, clientid, casetitle, caseid, redirectAfterTransfer } = props
    const [TransferLoading, setTransferLoading] = useState(false)
    const [total_case_fee, setTotal_case_fee] = useState("")
    const [commission_rate, setCommission_rate] = useState("")
    const [application_fee, setApplication_fee] = useState("")
    const [total_payable_amount, setTotal_payable_amount] = useState("")
    const [total_payable_amount_converted, setTotal_payable_amount_converted] = useState("")
    const [sp_currency, setSp_currency] = useState("")
    const [admin_stripe_currency, setAdmin_stripe_currency] = useState("")
    const [admin_stripe_balance, setAdmin_stripe_balance] = useState("")
    const [sp_stripe_account_id, setSp_stripe_account_id] = useState("")
    const [conversionRate, setConversionRate] = useState(null)
    const dispatch = useDispatch();
    const response = useSelector((state) => state.FinalPaymentTransferResponse);

    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/transfer-info/' + urlvalues[3]
        }
        axios(config)
        .then((res) => {
            var data = res.data['transfer_info']
            setTotal_case_fee(data['total_case_fee'])
            setCommission_rate(data['commission_rate'])
            setApplication_fee(data['application_fee'])
            setTotal_payable_amount(data['total_payable_amount'])
            setSp_currency(data['sp_currency'])
            setAdmin_stripe_currency(data['admin_stripe_currency'])
            setAdmin_stripe_balance(data['admin_stripe_balance'])
            setSp_stripe_account_id(data['sp_stripe_account'])
            setTotal_payable_amount_converted(data['total_payable_amount_converted'])
            setConversionRate(data['conversion_rate'])
        })
        .catch((error) => {
            console.log(error.response)
        })
    }, [])

    useEffect(() => {

    }, [total_case_fee])

    // submission of transfer payment method
    const SubmitTransfer = () => {
        setTransferLoading(true)
        var currency = 'usd'
        if (sp_currency == "pound"){
            currency = 'gbp'
        }
        else if (sp_currency == "euro") {
            currency = 'eur'
        }
        var data = {
            'amount': total_payable_amount,
            'currency': currency,
            'destination': sp_stripe_account_id,
            'caseId':caseid,
            'caseTitle':casetitle,
            'clientId':clientid,
            'clientName':clientname,
            'spId':spid,
            'spName':spname,
            'total_payable_amount_converted': total_payable_amount_converted,
            'conversion_rate': conversionRate,
            'commission_rate': commission_rate,
            'application_fee': application_fee
        }
        const config = {
            method: 'post',
            url: '/api/v1/transfer',
            data: data
        }
        axios(config)
        .then((res) => {
            dispatch(FinalPaymentTransferDispatcher(res.data))
            setTimeout(() => {
                setTransferLoading(false)
                redirectAfterTransfer()
            }, 2000);
        })
        .catch((error) => {
            setTransferLoading(false)
        })
    }

     // Modal box action listener
  const OpenPaymentReleaseModal = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
            <div class="flex px-4">
              <h1 class="text-3xl text-blue-600 px-4">
                {t("send_funds_to")} {spname}
              </h1>
            </div>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <div
                class={`items-center bg-blue-100 text-black px-4 py-3 mb-3`}
                role="alert"
              >
                <div class="flex">
                  <div class="py-1">
                    <svg
                      class="fill-current w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-bold text-md text-gray-800">
                      {t("you_are_about_to_pay")} {total_payable_amount}{" "}
                      {sp_currency} {t("stripe balance")}.
                    </p>
                    <p class="text-sm text-gray-800 my-1">
                      <b>
                        {total_payable_amount} {sp_currency}
                      </b>{" "}
                      {t("from_your_strip_account_is_being_paid_to")}{" "}
                      <b>{spname}</b>
                      {t("on_behalf_of")} <b>{clientname}</b>
                      {t("for_the_case")} - <b>{casetitle}</b>.
                    </p>
                  </div>
                </div>
              </div>
              <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                <div class="mb-2">
                  <p class="text-md font-bold text-gray-900">
                    {t("your_available_stripe_balance")}{" "}
                    {admin_stripe_balance / 100} {admin_stripe_currency}
                  </p>
                </div>
                <div class="my-1">
                  <p class="text-sm text-gray-900">
                    {t("total_case_fee")} ({sp_currency})
                  </p>
                </div>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="file_title"
                  type="text"
                  defaultValue={total_case_fee}
                  disabled
                />
                <div class="my-1">
                  <p class="text-sm text-gray-900">
                    {t("application_fee")} ({sp_currency})
                  </p>
                </div>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="file_title"
                  type="text"
                  defaultValue={application_fee}
                  disabled
                />
                <div class="my-1">
                  <p class="text-sm text-gray-900">
                    {t("amount_to_be_paid")} ({sp_currency})
                  </p>
                </div>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="file_title"
                  type="text"
                  defaultValue={total_payable_amount}
                  disabled
                />
              </div>
              <div class="flex justify-end mx-3">
                <button
                  onClick={onClose}
                  class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    SubmitTransfer();
                    onClose();
                  }}
                  class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-blue-600 border-blue-600 hover:border-transparent hover:text-white hover:bg-blue-600 mt-4 lg:mt-0"
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </div>
        );
      },
      title: "Confirm to submit",
    });
  };

  return (
    <div>
      {TransferLoading ? (
        <div class="">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      ) : (
        <button
          class="bg-blue-600 text-white px-3 py-2"
          onClick={() => OpenPaymentReleaseModal()}
        >
          {t("release_payment")}
        </button>
      )}
    </div>
  );
};

export default withTranslation()(TransferPayment);