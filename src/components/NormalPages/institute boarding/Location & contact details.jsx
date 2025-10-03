import React from 'react'

import { TextInput, SelectInput, NumberInput } from './FormElements'

export const locationData = {
  India: {
    Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco"],
    Texas: ["Houston", "Dallas"],
  },
};


const ContactDetails = ({ data, onChange }) => {

  const handleCountryChange = (e) => {
    const value = e.target.value;
    onChange({target:{name:"country", value:value}});
    onChange({target:{name:"state", value:''}});
    onChange({target:{name:"city", value:''}});
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    onChange({target:{name:"state", value:value}});
    onChange({target:{name:"city", value:''}});
  };

  const handleCityChange = (e) => {
    onChange(e);
  };

  const countries = Object.keys(locationData);
  const states = data.country ? Object.keys(locationData[data.country]) : [];
  const cities = data.country && data.state ? locationData[data.country][data.state] : [];


  return (
    <div>
      <h1 className='text-[24px] font-bold text-primary'>Location & contact details</h1>
      <div className='w-full flex flex-col mt-[30px] gap-[30px]'>
        <div className='flex flex-col md:flex-row gap-[30px]'>
          <TextInput
            placeholder="Full Address"
            name="fullAddress"
            value={data.fullAddress}
            onChange={onChange}
          />
          <SelectInput
            placeholder="Select Country"
            name="country"
            value={data.country}
            onChange={handleCountryChange}
            options={countries}
          />
        </div>

        <div className='flex flex-col md:flex-row md:gap-[15px] gap-[30px]'>
          <NumberInput
            placeholder="Pin Code"
            name="pinCode"
            value={data.pinCode}
            onChange={onChange}
          />
          <SelectInput
            placeholder="Select City"
            name="city"
            value={data.city}
            onChange={handleCityChange}
            options={cities}
          />
          <SelectInput
            placeholder="Select State"
            name="state"
            value={data.state}
            onChange={handleStateChange}
            options={states}
          />
        </div>

        <label className='text-black font-medium text-[16px] ml-[15px]'>Contact Information</label>
        <div className='bg-white shadow-custom-field rounded-[20px] p-[15px] md:p-[30px] flex flex-col gap-[30px]'>
          <h1 className='text-black/40 text-[16px] pl-[15px]'>Primary Contact</h1>
          <div className='flex flex-col md:flex-row gap-[30px] mt-[-15px]'>
            <TextInput
            placeholder="Name"
            name="primaryContactName"
            value={data.primaryContactName}
            onChange={onChange}
          />
          <TextInput
            placeholder="Designation"
            name="primaryDesignation"
            value={data.primaryDesignation}
            onChange={onChange}
          />
          </div>
          <div className='flex flex-col md:flex-row gap-[30px]'>
            <TextInput
              placeholder="Email"
              name="primaryEmail"
              value={data.primaryEmail}
              onChange={onChange}
            />
            <TextInput
              placeholder="Phone"
              name="primaryPhone"
              value={data.primaryPhone}
              onChange={onChange}
            />
            </div>
        </div>

        <div className='bg-white shadow-custom-field rounded-[20px] p-[15px] md:p-[30px] flex flex-col gap-[30px]'>
          <h1 className='text-black/40 text-[16px] pl-[15px]'>Secondary Contact</h1>
          <div className='flex flex-col md:flex-row gap-[30px] mt-[-15px]'>
            <TextInput
            placeholder="Name"
            name="secondaryContactName"
            value={data.secondaryContactName}
            onChange={onChange}
          />
          <TextInput
            placeholder="Designation"
            name="secondaryDesignation"
            value={data.secondaryDesignation}
            onChange={onChange}
          />
          </div>
          <div className='flex flex-col md:flex-row gap-[30px]'>
            <TextInput
              placeholder="Email"
              name="secondaryEmail"
              value={data.secondaryEmail}
              onChange={onChange}
            />
            <TextInput
              placeholder="Phone"
              name="secondaryPhone"
              value={data.secondaryPhone}
              onChange={onChange}
            />
            </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetails