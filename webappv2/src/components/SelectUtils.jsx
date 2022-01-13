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