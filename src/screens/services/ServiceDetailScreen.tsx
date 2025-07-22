import React, { useState, useEffect } from "react";
import { Button, Tag, Space, Table, Typography, Spin, Rate, Breadcrumb, Row, Col, Card, Pagination } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { UserOutlined } from '@ant-design/icons';
import { PetServiceDetail, PetServiceStep, IServiceDetailResponse } from "../../types/IServices";
import { useFetchService } from "../../hooks/services/useFetchService";
import { useParams } from "react-router";
import { petServiceColumns } from "../../components/features/services/PetServiceColumns";
import PetServiceModals from "../../components/features/services/PetServiceModals";
import { useUpdateService } from "../../hooks/services/useUpdateService";
import { useDeleteServiceDetail, useDeleteServiceStep } from "../../hooks/services/useDeleteService";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { getServiceReviews } from "../../services/services.service";
import { IServiceReview } from "../../types/IServices";

const ServiceDetail: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const { data: serviceDetail, isLoading, isError } = useFetchService(serviceId);
    const updateServiceMutation = useUpdateService(serviceId);

    const deleteServiceDetailMutation = useDeleteServiceDetail();
    const deleteServiceStepMutation = useDeleteServiceStep();

    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isStepModalVisible, setIsStepModalVisible] = useState(false);
    const [isStepUpdateModalVisible, setIsStepUpdateModalVisible] = useState(false);
    const [isServiceDetailModalVisible, setIsServiceDetailModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState<PetServiceDetail | null>(null);
    const [localServiceDetail, setLocalServiceDetail] = useState<IServiceDetailResponse | null>(null);
    const [newStep, setNewStep] = useState<PetServiceStep | null>(null);
    const [reviews, setReviews] = useState<IServiceReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const reviewsPerPage = 10;
    const paginatedReviews = reviews.slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage);

    useEffect(() => {
        const storageKey = `serviceDetail_${serviceId}`;
        const savedServiceDetail = localStorage.getItem(storageKey);

        if (savedServiceDetail) {
            try {
                const parsedData = JSON.parse(savedServiceDetail);
                setLocalServiceDetail(parsedData);
            } catch (error) {
                console.error("Error parsing saved service data:", error);
            }
        } else if (serviceDetail) {
            setLocalServiceDetail(serviceDetail);
        }
    }, [serviceId]);

    useEffect(() => {
        if (serviceDetail && !localServiceDetail) {
            setLocalServiceDetail(serviceDetail);
        }
    }, [serviceDetail]);

    useEffect(() => {
        const storageKey = `serviceDetail_${serviceId}`;

        if (localServiceDetail && serviceId) {
            localStorage.setItem(storageKey, JSON.stringify(localServiceDetail));
        }
    }, [localServiceDetail, serviceId]);

    useEffect(() => {
        if (serviceId) {
            setLoadingReviews(true);
            getServiceReviews(serviceId)
                .then((data) => setReviews(data))
                .catch(() => setReviews([]))
                .finally(() => setLoadingReviews(false));
        }
    }, [serviceId]);

    if (isLoading && !localServiceDetail) {
        return <Spin size="large" />;
    }

    if (isError && !localServiceDetail) {
        return <div>Lỗi: Không tìm thấy dịch vụ</div>;
    }

    // Breadcrumb label
    const breadcrumbName = localServiceDetail?.name || "Chi tiết dịch vụ";

    const handleUpdateServiceDetail = () => {
        setIsServiceDetailModalVisible(true);
    };

    const handleSaveServiceDetail = (values: IServiceDetailResponse) => {
        if (localServiceDetail) {
            const updatedService = {
                ...localServiceDetail,
                name: values.name,
                description: values.description,
                estimatedTime: values.estimatedTime,
                image: values.image,
                status: values.status
            };

            setLocalServiceDetail(updatedService);
            setIsServiceDetailModalVisible(false);
            Swal.fire("Thành công", "Cập nhật thông tin dịch vụ thành công", "success");
        }
    };

    const handleAddPetService = () => {
        setSelectedService(null);
        setIsAddModalVisible(true);
    };

    const handleAddPetServiceStep = () => {
        const existingSteps = localServiceDetail?.petServiceSteps || [];
        const nextPriority = existingSteps.length > 0
            ? Math.max(...existingSteps.map(step => step.priority)) + 1
            : 1;

        setNewStep({ id: '', name: '', description: '', priority: nextPriority });
        setIsStepModalVisible(true);
    };

    const handleUpdate = (service: PetServiceDetail) => {
        setSelectedService(service);
        setIsUpdateModalVisible(true);
    };

    const handleDelete = (detailId: string | null) => {
        Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (localServiceDetail) {
                    const updatedServiceDetails = localServiceDetail.petServiceDetails.filter(
                        detail => detail.id !== detailId
                    );

                    const updatedService = {
                        ...localServiceDetail,
                        petServiceDetails: updatedServiceDetails,
                    };
                    setLocalServiceDetail(updatedService);

                    if (detailId && detailId.trim() !== '') {
                        try {
                            await deleteServiceDetailMutation.mutateAsync({ serviceId, serviceDetailId: detailId });
                            console.log("Successfully deleted service detail with ID:", detailId);
                            Swal.fire(
                                "Đã xóa!",
                                "Chi tiết dịch vụ đã được xóa.",
                                "success"
                            );
                        } catch (error) {
                            console.error("Error deleting service detail:", error);
                            Swal.fire(
                                "Lỗi!",
                                "Không thể xóa từ máy chủ, nhưng đã xóa khỏi giao diện.",
                                "warning"
                            );
                        }
                    } else {
                        Swal.fire(
                            "Đã xóa!",
                            "Chi tiết dịch vụ đã được xóa.",
                            "success"
                        );
                    }
                }
            }
        });
    };

    const handleDeleteStep = (stepId: string | null) => {
        Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (localServiceDetail) {
                    const updatedServiceSteps = localServiceDetail.petServiceSteps.filter(
                        step => step.id !== stepId
                    );

                    const updatedService = {
                        ...localServiceDetail,
                        petServiceSteps: updatedServiceSteps,
                    };
                    setLocalServiceDetail(updatedService);

                    if (stepId && stepId.trim() !== '') {
                        try {
                            await deleteServiceStepMutation.mutateAsync({ serviceId, serviceStepId: stepId });
                            console.log("Successfully deleted service step with ID:", stepId);
                            Swal.fire(
                                "Đã xóa!",
                                "Bước dịch vụ đã được xóa.",
                                "success"
                            );
                        } catch (error) {
                            console.error("Error deleting service step:", error);
                            Swal.fire(
                                "Lỗi!",
                                "Không thể xóa từ máy chủ, nhưng đã xóa khỏi giao diện.",
                                "warning"
                            );
                        }
                    } else {
                        Swal.fire(
                            "Đã xóa!",
                            "Bước dịch vụ đã được xóa.",
                            "success"
                        );
                    }
                }
            }
        });
    };

    const handleSaveUpdate = (values: PetServiceDetail) => {
        if (localServiceDetail) {
            const updatedServiceDetails = localServiceDetail.petServiceDetails.map((service) =>
                service.id === values.id ? { ...service, ...values } : service
            );

            const updatedService = {
                ...localServiceDetail,
                petServiceDetails: updatedServiceDetails,
            };
            setLocalServiceDetail(updatedService);
            setIsUpdateModalVisible(false);
            Swal.fire("Thành công", "Cập nhật dịch vụ thành công", "success");
        }
    };

    const handleSaveAdd = (values: PetServiceDetail) => {
        if (localServiceDetail) {
            const updatedServiceDetails = [...localServiceDetail.petServiceDetails, values];

            const updatedService = {
                ...localServiceDetail,
                petServiceDetails: updatedServiceDetails,
            };

            setLocalServiceDetail(updatedService);
            setIsAddModalVisible(false);
            Swal.fire("Thành công", "Thêm chi tiết dịch vụ thú cưng thành công", "success");
        }
    };

    const handleUpdateStep = (step: PetServiceStep) => {
        setNewStep(step);
        setIsStepUpdateModalVisible(true);
    };

    const handleSaveStep = (step: PetServiceStep) => {
        if (localServiceDetail) {
            let updatedServiceSteps;

            if (step.id) {
                updatedServiceSteps = localServiceDetail.petServiceSteps.map(existingStep =>
                    existingStep.id === step.id ? { ...existingStep, ...step } : existingStep
                );
            } else {
                updatedServiceSteps = [...localServiceDetail.petServiceSteps, step];
            }

            const updatedService = {
                ...localServiceDetail,
                petServiceSteps: updatedServiceSteps,
            };

            setLocalServiceDetail(updatedService);
            setIsStepModalVisible(false);
            setIsStepUpdateModalVisible(false);
            Swal.fire("Thành công", step.id ? "Cập nhật bước dịch vụ thành công" : "Thêm bước dịch vụ thành công", "success");
        }
    };

    const handleSaveAllChanges = () => {
        const storageKey = `serviceDetail_${serviceId}`;
        const savedServiceDetail = localStorage.getItem(storageKey);
        console.log("savedServiceDetail", savedServiceDetail);

        if (savedServiceDetail) {
            try {
                const parsedData: IServiceDetailResponse = JSON.parse(savedServiceDetail);
                updateServiceMutation.mutate(parsedData, {
                    onSuccess: () => {
                        Swal.fire("Thành công", "Đã lưu tất cả thay đổi", "success");
                    },
                    onError: () => {
                        Swal.fire("Lỗi", "Không thể lưu thay đổi", "error");
                    }
                });
            } catch (error) {
                console.error("Error parsing saved service data:", error);
                Swal.fire("Lỗi", "Không thể lưu thay đổi", "error");
            }
        }
    };

    // Update petServiceColumns to include the new delete handler
    const columnsWithDelete = petServiceColumns(handleUpdate, handleDelete);

    return (
        <div style={{ padding: "20px" }}>
            <Breadcrumb style={{ marginBottom: 20 }}>
                <Breadcrumb.Item>
                    <Link to="/services">Dịch vụ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{breadcrumbName}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, padding: '20px 0' }}>
                {localServiceDetail?.image && (
                    <img
                        src={localServiceDetail.image}
                        alt={localServiceDetail.name}
                        style={{ width: 240, height: 160, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #eee', flexShrink: 0 }}
                    />
                )}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 12px #e6e6e6',
                        padding: '24px 32px',
                        position: 'relative',
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <Typography.Title level={2} style={{ margin: 0 }}>{localServiceDetail?.name}</Typography.Title>
                            <Button
                                type="primary"
                                onClick={handleUpdateServiceDetail}
                                style={{ minWidth: 120, fontWeight: 600, boxShadow: '0 2px 8px #d6e4ff' }}
                            >
                                Cập nhật
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                            <Tag color="blue" style={{ fontSize: 16, fontWeight: 600, padding: '4px 18px', borderRadius: 8, margin: 0, background: 'transparent' }}>
                                {localServiceDetail?.serviceCategoryName}
                            </Tag>
                            <Typography.Text style={{ fontSize: 17, color: '#d48806', fontWeight: 700, margin: '4px 0 0 0', display: 'block' }}>
                                Giá cơ bản: {localServiceDetail?.basePrice?.toLocaleString('vi-VN')} VNĐ
                            </Typography.Text>
                        </div>
                        <Typography.Paragraph style={{ fontSize: 16, color: '#555', marginBottom: 8 }}>{localServiceDetail?.description}</Typography.Paragraph>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', marginTop: 8 }}>
                            <Typography.Text strong style={{ fontSize: 15 }}>
                                Thời gian ước tính: {localServiceDetail?.estimatedTime
                                    ?.replace(/minutes?/gi, 'phút')
                                    ?.replace(/hours?/gi, 'giờ')
                                    ?.replace(/days?/gi, 'ngày')}
                            </Typography.Text>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Rate disabled value={localServiceDetail?.ratingAverage} style={{ fontSize: 15 }} />
                                <Typography.Text type="secondary">
                                    ({localServiceDetail?.totalReviews} đánh giá)
                                </Typography.Text>
                            </span>
                            <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                                Số lần sử dụng: {localServiceDetail?.totalUsed}
                            </Typography.Text>
                            <Tag color={localServiceDetail?.status ? "green" : "volcano"} style={{ fontSize: 15, padding: '2px 12px', borderRadius: 8 }}>
                                {localServiceDetail?.status ? "Hoạt động" : "Không hoạt động"}
                            </Tag>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Chi tiết dịch vụ thú cưng
                </Typography.Title>
                <Button
                    type="primary"
                    icon={<AiOutlinePlus />}
                    onClick={handleAddPetService}
                    style={{
                        marginLeft: "20px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 16px",
                        fontSize: "14px"
                    }}
                >
                    Thêm chi tiết dịch vụ
                </Button>
            </div>

            <Table
                columns={columnsWithDelete}
                dataSource={localServiceDetail?.petServiceDetails}
                rowKey="id"
                pagination={false}
                style={{ flex: 1 }}
            />

            <Typography.Title level={4}>Các bước dịch vụ</Typography.Title>
            <Button
                type="primary"
                style={{ marginTop: 10, marginBottom: 20 }}
                icon={<AiOutlinePlus />}
                onClick={handleAddPetServiceStep}
            >
                Thêm bước dịch vụ
            </Button>
            <div style={{ width: '40%', paddingLeft: "30px", borderLeft: "2px solid #1890ff", marginBottom: "20px" }}>
                {localServiceDetail?.petServiceSteps?.map((step, index) => (
                    <div
                        key={step.id}
                        style={{
                            marginBottom: "20px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        backgroundColor: "#1890ff",
                                        color: "#fff",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <Typography.Text strong style={{ fontSize: "16px" }}>
                                    {step.name}
                                </Typography.Text>
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    style={{ minWidth: 100, fontWeight: 600, boxShadow: '0 2px 8px #d6e4ff', marginRight: 8 }}
                                    onClick={() => handleUpdateStep(step)}
                                >
                                    Cập nhật
                                </Button>
                                <Button
                                    danger
                                    style={{ minWidth: 80, fontWeight: 600, boxShadow: '0 2px 8px #ffe6e6' }}
                                    onClick={() => handleDeleteStep(step?.id)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                        <Typography.Paragraph style={{ marginTop: "5px", color: "#595959" }}>
                            {step.description}
                        </Typography.Paragraph>
                    </div>
                ))}
            </div>

            {/* Lưu ý trước nút Lưu tất cả thay đổi */}
            <div style={{
                background: '#fffbe6',
                border: '1px solid #ffe58f',
                borderRadius: 8,
                padding: '16px 20px',
                marginTop: 32,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12
            }}>
                <span style={{ color: '#faad14', fontSize: 22, marginRight: 8 }}>
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z" stroke="#faad14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span style={{ color: '#ad6800', fontWeight: 600, fontSize: 16 }}>
                    Lưu ý: Nếu chưa nhấn nút Lưu tất cả thay đổi thì các cập nhật ở trên chưa được chấp thuận.
                </span>
            </div>
            <Button
                type="primary"
                style={{ marginTop: 20 }}
                onClick={handleSaveAllChanges}
            >
                Lưu tất cả thay đổi
            </Button>

            {/* Hiển thị review dịch vụ */}
            <Card style={{ marginTop: 24 }}>
                <Typography.Title level={4} style={{ marginBottom: 16, color: '#1570EF' }}>Đánh giá dịch vụ</Typography.Title>
                {loadingReviews ? (
                    <Spin />
                ) : reviews.length === 0 ? (
                    <Typography.Text type="secondary">Chưa có đánh giá nào cho dịch vụ này.</Typography.Text>
                ) : (
                    <>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {paginatedReviews.map((review) => (
                                <Row key={review.id} gutter={16} align="middle" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
                                    <Col>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: '50%', background: '#E0E7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#1570EF', fontWeight: 700
                                        }}>
                                            <UserOutlined />
                                        </div>
                                    </Col>
                                    <Col flex="auto">
                                        <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                            <Space>
                                                <Typography.Text strong>{review.userName}</Typography.Text>
                                                <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
                                            </Space>
                                            <Typography.Text style={{ fontSize: 15 }}>{review.comment}</Typography.Text>
                                        </Space>
                                    </Col>
                                </Row>
                            ))}
                        </Space>
                        {/* Pagination controls */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 24,
                          }}
                        >
                          <Pagination
                            current={currentReviewPage}
                            total={reviews.length}
                            pageSize={reviewsPerPage}
                            onChange={(page) => setCurrentReviewPage(page)}
                            showSizeChanger={false}
                          />
                        </div>
                    </>
                )}
            </Card>

            <PetServiceModals
                isUpdateModalVisible={isUpdateModalVisible}
                isAddModalVisible={isAddModalVisible}
                isStepModalVisible={isStepModalVisible}
                isStepUpdateModalVisible={isStepUpdateModalVisible}
                isServiceDetailModalVisible={isServiceDetailModalVisible}
                selectedService={selectedService}
                newStep={newStep}
                localServiceDetail={localServiceDetail}
                setIsUpdateModalVisible={setIsUpdateModalVisible}
                setIsAddModalVisible={setIsAddModalVisible}
                setIsStepModalVisible={setIsStepModalVisible}
                setIsStepUpdateModalVisible={setIsStepUpdateModalVisible}
                setIsServiceDetailModalVisible={setIsServiceDetailModalVisible}
                handleSaveUpdate={handleSaveUpdate}
                handleSaveAdd={handleSaveAdd}
                handleSaveStep={handleSaveStep}
                handleUpdateStep={handleSaveStep}
                handleSaveServiceDetail={handleSaveServiceDetail}
            />
        </div>
    );
};

export default ServiceDetail;