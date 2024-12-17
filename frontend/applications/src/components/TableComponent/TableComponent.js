import React, { useState, useEffect } from "react";
import { Table, Input, Spin, message } from "antd";
import axios from "axios";

const { Search } = Input;

const TableComponent = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [error, setError] = useState(null);

  // Fetch applications data
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/RashitKhamidullin/Educhain-Assignment/refs/heads/main/applications"
        );
        setApplications(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError("Failed to fetch data.");
        message.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Application No",
      dataIndex: "applicationNO",
      key: "applicationNO",
      sorter: (a, b) => a.applicationNO - b.applicationNO,
    },
    {
      title: "Applicant Name",
      dataIndex: "applicantName",
      key: "applicantName",
      sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      key: "applicationDate",
      sorter: (a, b) => new Date(a.applicationDate) - new Date(b.applicationDate),
    },
    {
      title: "Student ID",
      dataIndex: "studentID",
      key: "studentID",
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Status (English)",
      dataIndex: "status_En",
      key: "status_En",
    },
    {
      title: "Status (Arabic)",
      dataIndex: "status_Ar",
      key: "status_Ar",
    },
    {
      title: "Last Updated",
      dataIndex: "lastDate",
      key: "lastDate",
      sorter: (a, b) => new Date(a.lastDate) - new Date(b.lastDate),
    },
  ];

  // Handle Search
  const handleSearch = (value) => {
    const filtered = applications.filter(
      (app) =>
        app.applicantName.toLowerCase().includes(value.toLowerCase()) ||
        app.status_En.toLowerCase().includes(value.toLowerCase()) ||
        app.studentID.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  // Handle Table Change (Pagination and Sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  if (loading) {
    return <Spin tip="Loading applications..." />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Search
        placeholder="Search by Applicant Name, Status, or Student ID"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="applicationNO"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TableComponent;
