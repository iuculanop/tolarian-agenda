import React from 'react';
import { Select } from 'antd';

export function generateSetSelects(sets) {
    if (sets && sets.value) {
        const vals = sets.value.payLoad;
        const selset = vals.map(setMTG => (
            <Select.Option key={setMTG.code} value={setMTG.code}>
                {setMTG.name.toUpperCase()}
            </Select.Option>));
        return selset;
    }
    return (<></>);
}

export function generateLanguageOptions(languages) {
    //TODO: fare caso in cui non venga passato nulla come parametro
    if (languages) {
        const sellang = languages.map(l => (
            <Select.Option key={l.value} value={l.value+'_'+l.lang}>
                {l.lang}
            </Select.Option>
        ))
        return sellang;
    }
}