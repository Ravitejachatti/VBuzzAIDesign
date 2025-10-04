let applications = [
    {
      id: 1,
      name: 'Ravi Kumar',
      program: 'B.Tech CSE',
      status: 'Pending',
      documentUrl: 'https://example.com/document1.pdf'
    },
    {
      id: 2,
      name: 'Anjali Sharma',
      program: 'MBA',
      status: 'Verified',
      documentUrl: 'https://example.com/document2.pdf'
    }
  ];
  
  export const getAllApplications = async () => {
    return [...applications];
  };
  
  export const updateApplicationStatus = async (id, newStatus) => {
    applications = applications.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    return { success: true };
  };
  