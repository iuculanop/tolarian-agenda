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

export function generateBinderOptions(binders) {
    const selbinders = [];
    selbinders.push(<Select.Option key="default" value="0">No binder</Select.Option>);
    if (binders.length > 0) {
        binders.forEach(element => {
            selbinders.push(<Select.Option key={element.binderId} value={element.binderId}>{element.binderName}</Select.Option>)
        });
    }
    return selbinders;
}