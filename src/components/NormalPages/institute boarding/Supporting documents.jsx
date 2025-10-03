import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const SupportingDocuments = ({ data, onChange }) => {
  const [previewImages, setPreviewImages] = useState({});
  const fileInputs = useRef({});

  const triggerChange = (name, value) => {
    const event = new Event('change', { bubbles: true });
    Object.defineProperty(event, 'target', {
      writable: false,
      value: {
        name,
        value,
      },
    });
    onChange(event);
  };

  const handleFileChange = (name, files, isMultiple = false) => {
    if (!files || files.length === 0) return;

    if (isMultiple) {
      const fileArray = Array.from(files);
      const updated = [...(data[name] || []), ...fileArray];
      triggerChange(name, updated);

      // Update preview
      const previews = fileArray.map((file) => {
        const url = URL.createObjectURL(file);
        return url;
      });
      setPreviewImages((prev) => ({
        ...prev,
        [name]: [...(prev[name] || []), ...previews],
      }));
    } else {
      const file = files[0];
      triggerChange(name, file);

      if (file?.type?.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImages((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImages((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    }
  };

  const removeFile = (name, index = null) => {
    if (fileInputs.current[name]) {
      fileInputs.current[name].value = '';
    }

    if (index !== null) {
      const updatedFiles = [...(data[name] || [])];
      updatedFiles.splice(index, 1);
      triggerChange(name, updatedFiles);

      const updatedPreviews = [...(previewImages[name] || [])];
      updatedPreviews.splice(index, 1);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: updatedPreviews,
      }));
    } else {
      triggerChange(name, null);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const documentTypes = [
    {
      name: 'registrationCertificate',
      label: 'Registration Certificate',
      accept: '.pdf,.doc,.docx',
      description: 'Upload your institution\'s registration certificate'
    },
    {
      name: 'accreditationDocuments',
      label: 'Accreditation Documents',
      accept: '.pdf,.doc,.docx',
      description: 'Upload accreditation documents'
    },
    {
      name: 'brochure',
      label: 'Brochure',
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
      description: 'Upload your institution brochure'
    },
    {
      name: 'placementReport',
      label: 'Placement Report',
      accept: '.pdf,.xls,.xlsx',
      description: 'Upload recent placement statistics'
    },
    {
      name: 'campusPhotos',
      label: 'Campus Photos',
      accept: 'image/*',
      description: 'Upload images of your campus',
      multiple: true
    }
  ];

  return (
    <div className='w-full md:w-[600px]'>
      <h1 className='text-[24px] font-bold text-primary'>Supporting Documents</h1>
      <div className='w-full flex flex-col mt-[30px] gap-[30px]'>
        {documentTypes.map((doc) => (
          <div key={doc.name} className='w-full bg-white shadow-custom-field rounded-[20px] p-[15px] md:p-[30px]'>
            <h2 className='text-black font-medium text-[18px] mb-4'>{doc.label}</h2>
            <p className='text-gray-500 text-sm mb-4'>{doc.description}</p>

            <div className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[20px] p-6 hover:border-primary transition-colors'>
              <label className='cursor-pointer flex flex-col items-center w-full'>
                <FaCloudUploadAlt className='text-primary text-4xl mb-2' />
                <span className='text-primary font-medium'>Click to upload</span>
                <span className='text-gray-500 text-xs mt-1'>{doc.accept}</span>
                <input
                  ref={el => (fileInputs.current[doc.name] = el)}
                  type="file"
                  name={doc.name}
                  accept={doc.accept}
                  onChange={(e) =>
                    handleFileChange(doc.name, e.target.files, doc.multiple || false)
                  }
                  className='hidden'
                  multiple={doc.multiple || false}
                />
              </label>
            </div>

            {/* Preview Section */}
            <div className='mt-4'>
              {doc.multiple ? (
                <div className='flex flex-wrap gap-4'>
                  {(data[doc.name] || []).map((file, index) => (
                    <div key={index} className='relative w-32 h-32 border rounded-lg overflow-hidden'>
                      {file?.type?.startsWith('image/') ? (
                        <>
                          <img
                            src={previewImages[doc.name]?.[index] || URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className='w-full h-full object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeFile(doc.name, index)}
                            className='absolute top-1 right-1 bg-white rounded-full p-1 shadow-md'
                          >
                            <FaTimes className='text-red-500 text-xs' />
                          </button>
                        </>
                      ) : (
                        <div className='w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2'>
                          <span className='text-xs font-medium truncate w-full text-center'>{file.name}</span>
                          <button
                            type='button'
                            onClick={() => removeFile(doc.name, index)}
                            className='mt-2 text-red-500 hover:text-red-700'
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : data[doc.name] && (
                <div className='mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                  <div className='flex items-center'>
                    {data[doc.name]?.type?.startsWith('image/') ? (
                      <img
                        src={previewImages[doc.name] || URL.createObjectURL(data[doc.name])}
                        alt={doc.label}
                        className='w-12 h-12 object-cover mr-3 rounded'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-primary/10 flex items-center justify-center mr-3 rounded'>
                        <span className='text-primary font-bold text-xs'>DOC</span>
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium'>{data[doc.name]?.name || 'Document'}</span>
                      <span className='text-xs text-gray-500'>
                        {data[doc.name]?.size ? `${(data[doc.name].size / 1024).toFixed(2)} KB` : 'Size unknown'}
                      </span>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeFile(doc.name)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportingDocuments;
