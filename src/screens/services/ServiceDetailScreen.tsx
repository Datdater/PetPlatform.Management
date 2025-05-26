import React, { useState, useEffect } from "react";
import { Button, Tag, Space, Table, Typography, Spin } from "antd";
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
        return <div>Error: Service not found</div>;
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
            Swal.fire("Success", "Service details updated successfully", "success");
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
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
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
                                "Deleted!",
                                "Service detail has been deleted.",
                                "success"
                            );
                        } catch (error) {
                            console.error("Error deleting service detail:", error);
                            Swal.fire(
                                "Error!",
                                "Failed to delete from server, but removed from UI.",
                                "warning"
                            );
                        }
                    } else {
                        Swal.fire(
                            "Removed!",
                            "Service detail has been removed.",
                            "success"
                        );
                    }
                }
            }
        });
    };

    const handleDeleteStep = (stepId: string | null) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
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
                                "Deleted!",
                                "Service step has been deleted.",
                                "success"
                            );
                        } catch (error) {
                            console.error("Error deleting service step:", error);
                            Swal.fire(
                                "Error!",
                                "Failed to delete from server, but removed from UI.",
                                "warning"
                            );
                        }
                    } else {
                        Swal.fire(
                            "Removed!",
                            "Service step has been removed.",
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
            Swal.fire("Success", "Service updated successfully", "success");
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
            Swal.fire("Success", "Pet service added successfully", "success");
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
            Swal.fire("Success", step.id ? "Pet service step updated successfully" : "Pet service step added successfully", "success");
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
                        Swal.fire("Success", "All changes saved successfully", "success");
                    },
                    onError: () => {
                        Swal.fire("Error", "Failed to save changes", "error");
                    }
                });
            } catch (error) {
                console.error("Error parsing saved service data:", error);
                Swal.fire("Error", "Failed to save changes", "error");
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
                        <Typography.Text strong>Estimated Time: {localServiceDetail?.estimatedTime}</Typography.Text>
                        <Tag color={localServiceDetail?.status ? "green" : "volcano"}>
                            {localServiceDetail?.status ? "Active" : "Inactive"}
                        </Tag>
                    </Space>
                </div>
            </div>

            <div style={{ paddingLeft: "5px" }}>
                <Button type="link" onClick={handleUpdateServiceDetail}>Update</Button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Pet Service Details
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
                    Add Pet Service Detail
                </Button>
            </div>

            <Table
                columns={columnsWithDelete}
                dataSource={localServiceDetail?.petServiceDetails}
                rowKey="id"
                pagination={false}
                style={{ flex: 1 }}
            />

            <Typography.Title level={4}>Service Steps</Typography.Title>
            <Button
                type="primary"
                style={{ marginTop: 10, marginBottom: 20 }}
                icon={<AiOutlinePlus />}
                onClick={handleAddPetServiceStep}
            >
                Add Pet Service Step
            </Button>
            <div style={{ paddingLeft: "30px", borderLeft: "2px solid #1890ff", marginBottom: "20px" }}>
                {localServiceDetail?.petServiceSteps?.map((step, index) => (
                    <div
                        key={step.id}
                        style={{
                            marginBottom: "20px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                                <Button type="link" onClick={() => handleUpdateStep(step)}>Update</Button>
                                <Button type="link" danger onClick={() => handleDeleteStep(step?.id)}>Delete</Button>
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
                Save All Changes
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