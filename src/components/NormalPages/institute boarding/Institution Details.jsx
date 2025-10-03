import { TextInput, SelectInput, EmailInput, PasswordInput,TextArea, MultiSelectInput } from '../institute boarding/FormElements';

const InstitutionDetails = ({ data, onChange }) => {
  return (
    <div>
      <h1 className='text-[24px] font-bold text-primary'>Your Institution Details</h1>
      <form className='flex flex-col gap-[30px] mt-8'>
        <div className='flex flex-col md:flex-row gap-[30px]'>
          <TextInput
            placeholder="Name of Institute"
            name="instituteName"
            value={data.instituteName}
            onChange={onChange}
          />

          <SelectInput
            placeholder="Type of Institute"
            name="instituteType"
            options={['Public', 'Private', 'Government']}
            value={data.instituteType}
            onChange={onChange}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-[30px]'>
          <EmailInput
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={onChange}
          />

          <PasswordInput
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={onChange}
          />
        </div>

          <TextArea
            label="Vision"
            name="vision"
            placeholder="Describe your institution's vision and long-term mission in a few sentences. Example: 'To empower students with innovative learning and global opportunities"
            value={data.vision}
            onChange={onChange}
          />

          <MultiSelectInput
            label="Goals"
            placeholder="Select Goal"
            name="goal"
            options={['Education Enhancements', 'Placement & Recruitment', 'skill development', 'industry collaboration']}
            value={data.goal}
            onChange={onChange}
          />
      </form>
    </div>
  );
};

export default InstitutionDetails;