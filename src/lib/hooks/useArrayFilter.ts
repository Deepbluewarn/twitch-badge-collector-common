import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/minimal";
import { useAlertContext } from "../context/Alert";
import { ChatInfo } from "../interface/chat";
import { ChatInfoObjects } from "../interface/chatInfoObjects";
import { ENV } from "../interface/env";
import { ArrayFilterListInterface } from "../interface/filter";
import { arrayFiltersEqual, inIframe } from "../utils/utils";

export default function useArrayFilter(env: ENV) {
    Sentry.addBreadcrumb({
        type: env,
        category: "useArrayFilter",
    });
    const isIframe = inIframe();
    const localArrayFilter = JSON.parse(isIframe ? '[]' : (localStorage.getItem('tbc-filter') || '[]')) as ArrayFilterListInterface[];
    const [ arrayFilter, setArrayFilter ] = React.useState<ArrayFilterListInterface[]>(localArrayFilter);
    const arrayFilterRef = React.useRef<ArrayFilterListInterface[]>([]);
    const isFilterInitialized = useRef(false);
    const { addAlert } = useAlertContext();
    const { t } = useTranslation();

    React.useEffect(() => {

        if (isFilterInitialized.current && env === 'Extension') {
            import('webextension-polyfill').then(browser => {
                browser.storage.local.set({ filter: arrayFilter });
            });
        }

        arrayFilterRef.current = arrayFilter;
    }, [arrayFilter]);

    useEffect(() => {
        if(env !== 'Extension') return;

        import('webextension-polyfill').then(browser => {
            browser.storage.local.get("filter").then((res) => {
                setArrayFilter(res.filter);
                isFilterInitialized.current = true;
            });
        });
        
      }, []);

    const addArrayFilter = (newFilters: ArrayFilterListInterface[]) => {
        for(let newFilter of newFilters){
            const empty = newFilter.filters.some(row => row.value === '');

            if(empty) {
                addAlert({
                    message: t('alert.no_value_filter'),
                    serverity: 'warning'
                });
                return false;
            }
    
            setArrayFilter(afLists => {
                for (let af of afLists) {
                    if(arrayFiltersEqual(af.filters, newFilter.filters)){
                        addAlert({
                            message: t('alert.filter_already_exist'),
                            serverity: 'warning'
                        });
                        return afLists;
                    }
                }
    
                return [...afLists, newFilter];
            });
        }
        return true;
    }

    const checkFilter = (chat: ChatInfo, chatInfoObject?: ChatInfoObjects) => {
        if (typeof arrayFilterRef.current === 'undefined' || arrayFilterRef.current.length === 0) return false;

        Sentry.addBreadcrumb({
            type: env,
            category: "checkFilter",
            message: JSON.stringify(chat),
            data: chat
        });

        let res = false; // true 이면 해당 chat 을 포함, false 이면 제외.

        for(let arrayFilter of arrayFilterRef.current){
            const filterMatched = arrayFilter.filters.every((filter) => {
                let filterMatchedRes = false;

                if(filter.type === 'sleep'){
                    return filterMatchedRes;
                }

                if (filter.category === "badge") {
                    if(typeof chatInfoObject === 'undefined'){
                        filterMatchedRes = chat.badges.some(badge_uuid => {
                            return badge_uuid === filter.value;
                        });
                    }else{
                        filterMatchedRes = chat.badges.some(badge_str => {
                            const badge = chatInfoObject.channelBadges.get(badge_str) || chatInfoObject.globalBadges.get(badge_str);
                            
                            if (!badge) return false;
    
                            const badge_uuid = new URL(badge.image_url_1x).pathname.split('/')[3];
    
                            return badge_uuid === filter.value;
                        });
                    }
                    
                } else if (filter.category === "name") {
                    filterMatchedRes = chat.loginName.toLowerCase() === filter.value.toLowerCase() ||
                        chat.nickName.toLowerCase() === filter.value.toLowerCase();
                } else if (filter.category === "keyword") {
                    filterMatchedRes = chat.textContents.some(text => text !== null ? text.includes(filter.value) : false);
                }

                if(filter.type === 'exclude'){
                    filterMatchedRes = !filterMatchedRes;
                }

                return filterMatchedRes;
            });

            if(filterMatched){
                if(arrayFilter.filterType === 'include'){
                    // arrayFilter 가 include 이면 exclude 로 설정된 
                    // 다른 ArrayFilter 가 있는지 찾아야 하므로 계속 진행.
                    res = true; 
                }else if(arrayFilter.filterType === 'exclude'){
                    // arrayFilter 가 exclude 이면 다른 ArrayFilter 를 확인하지 않고 종료.
                    res = false; 
                    break;
                }else if(arrayFilter.filterType === 'sleep'){
                    // arrayFilter 가 sleep 이면 다른 ArrayFilter 를 확인하기 위해 계속 진행.
                    // sleep 으로 설정된 필터일때는 res 의 값을 바꾸지 않음.
                }
            }
        }

        return res;
    };

    return { arrayFilter, arrayFilterRef, setArrayFilter, addArrayFilter, checkFilter };
}