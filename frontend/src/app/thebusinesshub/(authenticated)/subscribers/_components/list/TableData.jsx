"use client";
import { deleteSubscriberAPI } from "@/api/newsletter";
import { toast } from "react-toastify";

const TableData = ({ subscribers, setSubscriberList, onDeleteSuccess }) => {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscriber?")) return;

        try {
            const userStr = sessionStorage.getItem("user");
            const token = userStr ? JSON.parse(userStr)?.token : null;

            if (!token) {
                toast.error("Authentication required");
                return;
            }

            const response = await deleteSubscriberAPI(id, token);
            if (response) {
                toast.success("Subscriber deleted successfully");
                setSubscriberList((prev) => prev.filter((item) => item._id !== id));
                if (typeof onDeleteSuccess === "function") {
                    onDeleteSuccess();
                }
            }
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            toast.error("Failed to delete subscriber");
        }
    };

    return (
        <div className="table-responsive mt30">
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Subscribed Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subscribers && subscribers.length > 0 ? (
                        subscribers.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td className="text-primary">{item.email}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${item.active ? 'bg-success' : 'bg-secondary'}`}>
                                        {item.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <ul className="view_edit_delete_list mb0">
                                        <li
                                            className="list-inline-item"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Delete"
                                        >
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                style={{ border: 'none', background: 'none', color: '#ff4b4b' }}
                                            >
                                                <span className="flaticon-garbage"></span>
                                            </button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No subscribers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableData;
