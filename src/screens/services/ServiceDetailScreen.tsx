import React, { useState, useEffect } from "react";
import { Button, Tag, Space, Table, Typography, Spin, Rate } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { PetServiceDetail, PetServiceStep, IServiceDetailResponse } from "../../types/IServices";
import { useFetchService } from "../../hooks/services/useFetchService";
import { useParams } from "react-router";
import { petServiceColumns } from "../../components/features/services/PetServiceColumns";
import PetServiceModals from "../../components/features/services/PetServiceModals";
import { useUpdateService } from "../../hooks/services/useUpdateService";
import { useDeleteServiceDetail, useDeleteServiceStep } from "../../hooks/services/useDeleteService";
import Swal from "sweetalert2";

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

    if (isLoading && !localServiceDetail) {
        return <Spin size="large" />;
    }

    if (isError && !localServiceDetail) {
        return <div>Lỗi: Không tìm thấy dịch vụ</div>;
    }

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
                <div style={{ flex: 1 }}>
                    <Typography.Title level={2}>{localServiceDetail?.name}</Typography.Title>
                    <Typography.Paragraph>{localServiceDetail?.description}</Typography.Paragraph>
                    <Space direction="vertical" size="middle">
                        <Typography.Text strong>Thời gian ước tính: {localServiceDetail?.estimatedTime}</Typography.Text>
                        <div>
                            <Rate disabled defaultValue={localServiceDetail?.ratingAverage} style={{ fontSize: 14 }} />
                            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                                ({localServiceDetail?.totalReviews} đánh giá)
                            </Typography.Text>
                        </div>
                        <div>
                            <Typography.Text type="secondary">
                                Số lần sử dụng: {localServiceDetail?.totalUsed}
                            </Typography.Text>
                        </div>
                        <Tag color={localServiceDetail?.status ? "green" : "volcano"}>
                            {localServiceDetail?.status ? "Hoạt động" : "Không hoạt động"}
                        </Tag>
                    </Space>
                </div>
            </div>

            <div style={{ paddingLeft: "5px" }}>
                <Button type="link" onClick={handleUpdateServiceDetail}>Cập nhật</Button>
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
            <div style={{ width: '30%', paddingLeft: "30px", borderLeft: "2px solid #1890ff", marginBottom: "20px" }}>
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
                                <Button type="link" onClick={() => handleUpdateStep(step)}>Cập nhật</Button>
                                <Button type="link" danger onClick={() => handleDeleteStep(step?.id)}>Xóa</Button>
                            </div>
                        </div>
                        <Typography.Paragraph style={{ marginTop: "5px", color: "#595959" }}>
                            {step.description}
                        </Typography.Paragraph>
                    </div>
                ))}
            </div>

            <Button
                type="primary"
                style={{ marginTop: 20 }}
                onClick={handleSaveAllChanges}
            >
                Lưu tất cả thay đổi
            </Button>

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