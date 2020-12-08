import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import "react-confirm-alert/src/react-confirm-alert.css";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const SACaseTransactions = ({ t }) => {
  const history = useHistory();
  const [transactions, setTransactions] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");

    const config = {
      method: "get",
      url: "/api/v1/sa-case-transactions/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setTransactions(res.data["transactions"]);
        setTableLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  useEffect(() => {}, [transactions]);

  return (
    <div>
      {!_.isEmpty(transactions) ? (
        <div class="">
          <div class="py-3">
            {tableLoading ? (
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                  <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                    <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                      <table class="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("date")}
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("payment_type")}
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("amount")}
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("type")}
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("application_fee")}
                            </th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {t("status")}
                            </th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                  <div class="h-4 bg-gray-400 rounded w-3/4"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-400 rounded"></div>
                    <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("date")}
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("phase")}
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("amount")}
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("type")}
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("application_fee")}
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t("status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((item, index) => {
                        return (
                          <tr>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p class="text-gray-900 whitespace-no-wrap">
                                {item.payment_date}
                              </p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p class="text-gray-900 whitespace-no-wrap">
                                {parseInt(item.due_amount) > 0 ? (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">
                                      {t("advance_payment")}{" "}
                                    </span>
                                  </span>
                                ) : (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">
                                      {t("final_payment")}
                                    </span>
                                  </span>
                                )}
                              </p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p class="text-gray-900 whitespace-no-wrap">
                                {item.paid_amount} / {item.currency}
                              </p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p class="text-gray-900 whitespace-no-wrap">
                                {item.received ? (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-teal-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-teal-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">
                                      {t("received")}
                                    </span>
                                  </span>
                                ) : (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">{t("sent")}</span>
                                  </span>
                                )}
                              </p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p class="text-gray-900 whitespace-no-wrap">
                                {item.application_fee ? (
                                  <>{item.application_fee} usd</>
                                ) : (
                                  "-"
                                )}
                              </p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {item.status == "completed" ? (
                                <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                  <span
                                    aria-hidden
                                    class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                  ></span>
                                  <span class="relative">{t("completed")}</span>
                                </span>
                              ) : (
                                <span class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                  <span
                                    aria-hidden
                                    class="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
                                  ></span>
                                  <span class="relative">{t("pending")}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default withTranslation()(SACaseTransactions);
