import React from 'react'
import { UrlInput } from '../institute boarding/FormElements'

const DigitalPresence  = ({ data, onChange}) => {
  return (
    <div className='flex flex-col gap-[30px]'>
      <h1 className='text-[24px] font-bold text-primary'>Digital Presence</h1>
      <UrlInput 
        name="linkedIn"
        placeholder="LinkedIn"
        value={data.linkedIn}
        onChange={onChange}
      />
      <UrlInput
        name="youTube"
        placeholder="YouTube"
        value={data.youTube}
        onChange={onChange}
      />
      <UrlInput
        name="instagram"
        placeholder="Instagram"
        value={data.instagram}
        onChange={onChange}
      />
      <UrlInput 
        name="website"
        placeholder="Website"
        value={data.website}
        onChange={onChange}
      />
      <UrlInput
        name="others"
        placeholder="Other Links"
        value={data.others}
        onChange={onChange}
      />
    </div>
  )
}

export default DigitalPresence