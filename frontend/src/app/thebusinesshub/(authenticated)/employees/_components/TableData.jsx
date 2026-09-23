"use client"; // Add this at the top
import { getEmployeeTableDataPaginated, deleteEmployeeAPI } from "@/api/employee";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

const TableData = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
  const router = useRouter();
  
  const fetchEmployeeData = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getEmployeeTableDataPaginated({ limit: PAGE_SIZE, page });
      setEmployeeList(Array.isArray(data?.items) ? data.items : []);
      setTotalCount(data?.totalCount ?? 0);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
      setEmployeeList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  // Custom modal functions (commented out - using window.confirm instead)
  // const handleDeleteClick = (id, name, e) => {
  //   e?.preventDefault();
  //   setDeleteConfirm({ show: true, id, name });
  // };

  // const confirmDelete = async () => {
  //   const { id } = deleteConfirm;
  //   setDeleteConfirm({ show: false, id: null, name: '' });

  //   try {
  //     const data = await deleteEmployeeAPI(id);
      
  //     if (data.status === 'success') {
  //       toast.success(data.message || 'Employee deleted successfully');
  //       // Update the list by removing the deleted employee
  //       setEmployeeList((prevEmployeeList) => 
  //         prevEmployeeList.filter((employee) => employee._id !== id)
  //       );
  //     } else {
  //       toast.error(data.message || 'Failed to delete employee');
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to delete Employee');
  //     console.error("Delete error:", error);
  //   }
  // };

  // const cancelDelete = () => {
  //   setDeleteConfirm({ show: false, id: null, name: '' });
  // };

  // Original delete function with window.confirm
  const deleteEmployee = async (id, e) => {
    e?.preventDefault(); // Prevent default link behavior
    
    const isConfirmed = window.confirm("Are you sure you want to delete this Employee?");
    if (!isConfirmed) return;

    try {
      const data = await deleteEmployeeAPI(id);
      
      if (data.status === 'success') {
        toast.success(data.message || 'Employee deleted successfully');
        // Update the list by removing the deleted employee
        setEmployeeList((prevEmployeeList) => 
          prevEmployeeList.filter((employee) => employee._id !== id)
        );
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || 'Failed to delete employee');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete Employee');
      console.error("Delete error:", error);
    }
  };
  let theadConent = [
    "Employee Name",
    "Designation",
    "Email",
    "Priority",
    "Status",
    "Action",
  ];
  
  useEffect(() => {
    fetchEmployeeData(currentPage);
  }, [currentPage]); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  let tbodyContent = employeeList && employeeList.length > 0 ? employeeList.map((item) => (
    <tr key={item._id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details">
            <div className="tc_content">
              <h4>{item.name || 'N/A'}</h4>
            </div>
          </div>
        </div>
      </td>
      {/* End td */}
      <td>{item.designation || 'N/A'}</td>
      {/* End td */}
      <td>{item.email || 'N/A'}</td>
      {/* End td */}
      <td>{item.priority !== undefined ? item.priority : 0}</td>
      {/* End td */}
      <td>
        <span className={`status_tag ${item.status ? 'badge2' : 'badge'}`}>
          {item.status ? "Active" : "Deactive"}
        </span>
      </td>
      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <button  onClick={() => router.push(`/thebusinesshub/employees/edit/${item._id}`)}>
              <span className="flaticon-edit"></span>
            </button>
          </li>
          {/* End li */}

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a href="#" onClick={(e) => deleteEmployee(item._id, e)}>
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
      {/* End td */}
    </tr>
  )) : null;
  
  return (
    <>
      {/* Custom Confirmation Modal (commented out - using window.confirm instead) */}
      {/* {deleteConfirm.show && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={cancelDelete}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              Confirm Delete
            </h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}

      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Loading employees...
              </td>
            </tr>
          ) : employeeList && employeeList.length > 0 ? (
            tbodyContent
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No employees found. <a href="/thebusinesshub/employees/add">Add your first employee</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalCount > PAGE_SIZE && (
        <div className="mt30">
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default TableData;
