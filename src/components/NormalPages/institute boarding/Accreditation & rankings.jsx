import React from 'react'

import { CheckboxGroup, RankingInputGroup } from '../institute boarding/FormElements'

const AccreditationAndRankings = ({data, onChange}) => {

  const addRanking = (type, item) => {
    const updated = [...(data[type] || []), item];
    onChange({ target: { name: type, value: updated } });
  };

  const removeRanking = (type, index) => {
    const updated = [...(data[type] || [])];
    updated.splice(index, 1);
    onChange({ target: { name: type, value: updated } });
  };

  return (
    <div>
      <h1>Accreditation & rankings</h1>
      <div className='flex flex-col gap-[30px] mt-[30px]'>
        <CheckboxGroup
        name="accreditations"
        options={['UGC', 'NAAC', 'AICTE', 'NBA', 'MCI', 'ICMR', 'CCIM', 'DCI', 'PCI', 'COA', 'NCTE', 'ICAI', 'IIL', 'QCI', 'BCI', 'NIOS', 'Others']}
        selectedValues={data.accreditations}
        onChange={onChange}
      />

      <h2 className="text-[20px] font-bold text-primary mb-2">Rankings</h2>
      <RankingInputGroup
        title="International Ranking"
        rankings={data.internationalRankings}
        onAdd={(item) => addRanking('internationalRankings', item)}
        onRemove={(index) => removeRanking('internationalRankings', index)}
      />

      <RankingInputGroup
        title="National Ranking"
        rankings={data.nationalRankings}
        onAdd={(item) => addRanking('nationalRankings', item)}
        onRemove={(index) => removeRanking('nationalRankings', index)}
      />
      </div>
    </div>
  )
}

export default AccreditationAndRankings