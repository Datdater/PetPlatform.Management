import {
  Button,
  Space,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Image,
  Tag,
  Spin,
  Rate,
  Pagination,
  Flex,
} from "antd";
import { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineReload, AiTwotoneEye } from "react-icons/ai";
import { useNavigate } from "react-router";
import { IServices } from "../../types/IServices";
import useFetchServices from "../../hooks/services/useFetchServices";
import { useDeleteService } from "../../hooks/services/useDeleteService.ts";
import Swal from "sweetalert2";

const ServicesScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

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

  useEffect(() => {
    document.title = "Quản lý Dịch vụ";
  }, []);

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
    <Space
      style={{ width: "100%", padding: "0px 20px" }}
      direction="vertical"
    >
      <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
        Quản lý Dịch vụ
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
        <Space align="center" style={{ width: "100%", marginBottom: 20 }}>
          <h3>Danh sách dịch vụ</h3>
          <div>
            <Button
              type="primary"
              style={{ marginLeft: "auto", marginRight: 10, background: '#d48806', borderColor: '#d48806' }}
              icon={<AiOutlinePlus />}
              onClick={handleAddView}
            >
              Thêm dịch vụ
            </Button>
            <Tooltip title="Tải lại">
              <Button
                type="primary"
                shape="circle"
                icon={<AiOutlineReload />}
                onClick={() => refetch()}
                style={{ background: '#d48806', borderColor: '#d48806' }}
              />
            </Tooltip>
          </div>
        </Space>

        <Spin spinning={isLoading}>
          <Row gutter={[16, 16]}>
            {services?.items.map((service) => (
              <Col xs={24} sm={12} md={6} key={service.id}>
                <Card
                  hoverable
                  style={{ cursor: 'pointer', height: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}
                  cover={
                    <Image
                      alt={service.name}
                      src={service.image || "https://via.placeholder.com/300x200"}
                      style={{ height: 160, objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    />
                  }
                  onClick={() => handleView(service.id)}
                >
                  <Card.Meta
                    title={
                      <>
                        {service.categoryName && (
                          <Tag color="blue" style={{ fontWeight: 600, fontSize: 14, borderRadius: 8, marginBottom: 4, display: 'inline-block' }}>
                            {service.categoryName}
                          </Tag>
                        )}
                        <div style={{ fontWeight: 600, fontSize: 17, minHeight: 32, maxHeight: 32, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
                      </>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Typography.Text style={{ color: '#d48806', fontWeight: 700, fontSize: 16 }}>
                            {service.basePrice?.toLocaleString('vi-VN')} VNĐ
                          </Typography.Text>
                        </div>
                        <div>
                          <Rate disabled defaultValue={service.ratingAverage} style={{ fontSize: 14 }} />
                          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                            ({service.totalReviews} đánh giá)
                          </Typography.Text>
                        </div>
                        <div>
                          <Typography.Text type="secondary">
                            Số lần sử dụng: {service.totalUsed}
                          </Typography.Text>
                        </div>
                        <div>
                          <Typography.Text strong>
                            Thời gian ước tính: {service.estimatedTime}
                          </Typography.Text>
                        </div>
                        <div>
                          <Tag color={service.status ? "green" : "volcano"}>
                            {service.status ? "Hoạt động" : "Không hoạt động"}
                          </Tag>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ marginRight: 8 }}
            >
              Trang trước
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * pageSize >= (services?.totalItemsCount || 0)}
            >
              Trang sau
            </Button>
          </div>
        </Spin>
      </div>
    </Space>
  );
};

export default ServicesScreen;
