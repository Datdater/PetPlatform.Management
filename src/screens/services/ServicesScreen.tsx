import {
  Button,
  Drawer,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
  Spin,
  Pagination,
  Flex,
} from "antd";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router";
import { IServices } from "../../types/IServices";
import useFetchServices from "../../hooks/services/useFetchServices";
import { useDeleteService } from "../../hooks/services/useDeleteService.ts";
import Swal from "sweetalert2";

const ServicesScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    data: services,
    isLoading,
    isError,
    refetch,
  } = useFetchServices({
    pageIndex: currentPage - 1,
    pageSize,
  });
  const navigate = useNavigate();
  const deleteServiceMutation = useDeleteService();
  const handleDelete = (serviceId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteServiceMutation.mutateAsync({ serviceId });
          Swal.fire("Deleted!", "Service has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting service:", error);
          Swal.fire("Error!", "Failed to delete the service.", "error");
        }
      }
    });
  };

  const columns: TableProps<IServices>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status ? "green" : "volcano"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: IServices) => (
        <Space size="middle">
          <a onClick={() => handleView(record.id)}>View</a>
          <a onClick={() => handleView(record.id)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    document.title = "Service Management";
  }, []);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return <div>Error loading services</div>;
  }
  const handleView = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleAddView = () => {
    navigate("/services/add-service");
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <Space
        style={{ width: "100%", padding: "0px 20px" }}
        direction="vertical"
      >
        <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
          Service Management
        </Typography>

        <div
          style={{
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 10,
            padding: "10px 20px",
            marginTop: 20,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Flex justify="space-between" align="center">
            <h3>Services List</h3>
            <div>
              <Button
                type="primary"
                style={{ marginLeft: "auto", marginRight: 10 }}
                icon={<AiOutlinePlus />}
                onClick={handleAddView}
              >
                Add Service
              </Button>
              <Tooltip title="Reload">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<AiOutlineReload />}
                  onClick={() => refetch()}
                />
              </Tooltip>
            </div>
          </Flex>
          <Table
            columns={columns}
            dataSource={services?.items}
            style={{ width: "100%" }}
            rowKey="id"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={services?.totalItemsCount || 0}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
          />
        </div>
      </Space>
      <Drawer
        closable
        destroyOnClose
        title={<p>Service Detail</p>}
        placement="right"
        width={600}
      >
        <p>Service details will be displayed here.</p>
      </Drawer>
    </>
  );
};

export default ServicesScreen;
