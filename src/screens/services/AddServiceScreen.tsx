import { Button, Form, Space, Steps, Typography, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import ServiceOverall from "../../components/features/services/ServiceOverall.tsx";
import ServiceDetailList from "../../components/features/services/ServiceDetailList.tsx";
import ServiceStep from "../../components/features/services/ServiceStep.tsx";
import {IServiceDetailResponse, PetServiceDetail, PetServiceStep} from "../../types/IServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCreateService } from "../../services/services.service";
import { useNavigate } from "react-router";

const NAVIGATION_TIMESTAMP_KEY = 'addServiceNavigationTimestamp';

// Define types for your step content functions
type ServiceOverallContent = (form: any) => React.ReactNode;
type ServiceDetailContent = (serviceData: IServiceDetailResponse | null, onUpdateDetails: (details: PetServiceDetail[]) => void) => React.ReactNode;
type ServiceStepContent = (serviceData: IServiceDetailResponse | null, onUpdateSteps?: (steps: PetServiceStep[]) => void) => React.ReactNode;

// Define a union type for all possible content functions
type StepContent = ServiceOverallContent | ServiceDetailContent | ServiceStepContent;

// Define your steps array with specific types
const steps = [
    {
        title: "Service Overall",
        content: ((form: any) => <ServiceOverall form={form} />) as ServiceOverallContent,
    },
    {
        title: "Service Detail List",
        content: ((serviceData: IServiceDetailResponse | null, onUpdateDetails: (details: PetServiceDetail[]) => void) => (
            <ServiceDetailList serviceData={serviceData} onUpdateDetails={onUpdateDetails} />
        )) as ServiceDetailContent,
    },
    {
        title: "Service Step List",
        content: ((serviceData: IServiceDetailResponse | null, onUpdateSteps?: (steps: PetServiceStep[]) => void) => (
            <ServiceStep serviceData={serviceData} onUpdateSteps={onUpdateSteps} />
        )) as ServiceStepContent,
    },
];
const AddServiceScreen = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [serviceData, setServiceData] = useState<IServiceDetailResponse | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: createService, isPending } = useMutation({
        mutationFn: (createdService: IServiceDetailResponse) => fetchCreateService(createdService),
        onSuccess: (createdService: IServiceDetailResponse) => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            navigate("/services", { replace: true });
            console.log("Service added successfully", createdService);
            message.success("Service created successfully!");
            // Clean up after successful creation
            localStorage.removeItem('addService');
            localStorage.removeItem('serviceDetails');
            localStorage.removeItem('serviceSteps');
            sessionStorage.removeItem(NAVIGATION_TIMESTAMP_KEY);
        },
        onError: (error) => {
            console.error("Error creating service:", error);
            message.error("Failed to create service!");
        }
    });

    useEffect(() => {
        const lastNavigationTime = sessionStorage.getItem(NAVIGATION_TIMESTAMP_KEY);
        const currentTime = Date.now();
        const isNewNavigation = !lastNavigationTime ||
            (currentTime - parseInt(lastNavigationTime, 10)) > 5000; // 5 seconds threshold

        if (isNewNavigation) {
            // This is a new navigation - clear previous data
            localStorage.removeItem('addService');
            localStorage.removeItem('serviceDetails');
            localStorage.removeItem('serviceSteps');
            form.resetFields();
            setServiceData(null);

            sessionStorage.setItem(NAVIGATION_TIMESTAMP_KEY, currentTime.toString());
        } else {
            const savedData = localStorage.getItem('addService');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);

                    // Check for saved details in separate storage
                    const savedDetails = localStorage.getItem('serviceDetails');
                    if (savedDetails) {
                        try {
                            const detailsArray = JSON.parse(savedDetails);
                            if (Array.isArray(detailsArray)) {
                                parsedData.petServiceDetails = detailsArray;
                            }
                        } catch (detailsError) {
                            console.error('Error parsing saved details:', detailsError);
                        }
                    }

                    // Check for saved steps in separate storage
                    const savedSteps = localStorage.getItem('serviceSteps');
                    if (savedSteps) {
                        try {
                            const stepsArray = JSON.parse(savedSteps);
                            if (Array.isArray(stepsArray)) {
                                parsedData.petServiceSteps = stepsArray;
                            }
                        } catch (stepsError) {
                            console.error('Error parsing saved steps:', stepsError);
                        }
                    }

                    setServiceData(parsedData);

                    setTimeout(() => {
                        form.setFieldsValue(parsedData);
                    }, 100);
                } catch (error) {
                    console.error('Error parsing saved service data:', error);
                }
            }

            sessionStorage.setItem(NAVIGATION_TIMESTAMP_KEY, currentTime.toString());
        }
    }, [form]);

    // Update localStorage when serviceData changes
    useEffect(() => {
        if (serviceData) {
            localStorage.setItem('addService', JSON.stringify(serviceData));
        }
    }, [serviceData]);

    const handleUpdateDetails = useCallback((details: PetServiceDetail[]) => {
        // Save details to separate localStorage entry
        localStorage.setItem('serviceDetails', JSON.stringify(details));

        // Also update main serviceData state
        setServiceData(prevData => {
            if (!prevData) return null;

            const updatedData = {
                ...prevData,
                petServiceDetails: details
            };

            // Update main localStorage as well
            localStorage.setItem('addService', JSON.stringify(updatedData));

            return updatedData;
        });
    }, []);

    const handleUpdateSteps = useCallback((steps: PetServiceStep[]) => {
        // Save steps to separate localStorage entry
        localStorage.setItem('serviceSteps', JSON.stringify(steps));

        // Also update main serviceData state
        setServiceData(prevData => {
            if (!prevData) return null;

            const updatedData = {
                ...prevData,
                petServiceSteps: steps
            };

            localStorage.setItem('addService', JSON.stringify(updatedData));

            return updatedData;
        });
    }, []);

    const next = () => {
        if (current === 0) {
            form.validateFields()
                .then((values: IServiceDetailResponse) => {
                    const existingDetails = serviceData?.petServiceDetails || [];
                    const existingSteps = serviceData?.petServiceSteps || [];

                    const updatedData = serviceData
                        ? {
                            ...serviceData,
                            ...values,
                            petServiceDetails: existingDetails,
                            petServiceSteps: existingSteps
                        }
                        : {
                            ...values,
                            petServiceDetails: [],
                            petServiceSteps: []
                        };

                    // Save to state and localStorage
                    setServiceData(updatedData);
                    localStorage.setItem('addService', JSON.stringify(updatedData));
                    setCurrent(current + 1);
                })
                .catch((info) => {
                    console.log('Validate Failed:', info);
                });
        } else if (current === 1) {
            // Special handling for ServiceDetailList step
            // Make sure we get the latest details from localStorage
            const savedDetails = localStorage.getItem('serviceDetails');
            let detailsArray: PetServiceDetail[] = [];

            if (savedDetails) {
                try {
                    const parsedDetails = JSON.parse(savedDetails);
                    if (Array.isArray(parsedDetails)) {
                        detailsArray = parsedDetails;
                    }
                } catch (error) {
                    console.error('Error parsing service details:', error);
                }
            }

            // Preserve steps from serviceData
            const existingSteps = serviceData?.petServiceSteps || [];

            // Update serviceData with the latest details
            const updatedData = {
                ...serviceData,
                petServiceDetails: detailsArray,
                petServiceSteps: existingSteps
            };

            setServiceData(updatedData as IServiceDetailResponse);
            localStorage.setItem('addService', JSON.stringify(updatedData));
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        // Load the most recent data from localStorage when going back
        const savedData = localStorage.getItem('addService');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);

                // Check for the latest details
                const savedDetails = localStorage.getItem('serviceDetails');
                if (savedDetails) {
                    try {
                        const detailsArray = JSON.parse(savedDetails);
                        if (Array.isArray(detailsArray)) {
                            parsedData.petServiceDetails = detailsArray;
                        }
                    } catch (detailsError) {
                        console.error('Error parsing saved details:', detailsError);
                    }
                }

                // Check for the latest steps
                const savedSteps = localStorage.getItem('serviceSteps');
                if (savedSteps) {
                    try {
                        const stepsArray = JSON.parse(savedSteps);
                        if (Array.isArray(stepsArray)) {
                            parsedData.petServiceSteps = stepsArray;
                        }
                    } catch (stepsError) {
                        console.error('Error parsing saved steps:', stepsError);
                    }
                }

                setServiceData(parsedData);
                // Set form values to match the loaded data
                form.setFieldsValue(parsedData);
            } catch (error) {
                console.error('Error parsing saved service data:', error);
            }
        }
        setCurrent(current - 1);
    };

    const handleCreateService = () => {
        // First, get the latest steps from localStorage
        const savedSteps = localStorage.getItem('serviceSteps');
        let stepsArray: PetServiceStep[] = [];

        if (savedSteps) {
            try {
                const parsedSteps = JSON.parse(savedSteps);
                if (Array.isArray(parsedSteps)) {
                    stepsArray = parsedSteps;
                }
            } catch (error) {
                console.error('Error parsing service steps:', error);
            }
        }

        // Get the latest details from localStorage
        const savedDetails = localStorage.getItem('serviceDetails');
        let detailsArray: PetServiceDetail[] = [];

        if (savedDetails) {
            try {
                const parsedDetails = JSON.parse(savedDetails);
                if (Array.isArray(parsedDetails)) {
                    detailsArray = parsedDetails;
                }
            } catch (error) {
                console.error('Error parsing service details:', error);
            }
        }

        // Final validation
        if (!serviceData) {
            message.error("No service data available!");
            return;
        }

        // Create the final service object
        const finalServiceData: IServiceDetailResponse = {
            ...serviceData,
            petServiceDetails: detailsArray,
            petServiceSteps: stepsArray
        };

        // Dispatch the API call
        createService(finalServiceData);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const renderContent = () => {
        const stepContent = steps[current].content;

        if (current === 0) {
            return (stepContent as ServiceOverallContent)(form);
        }

        if (current === 1) {
            return (stepContent as ServiceDetailContent)(serviceData, handleUpdateDetails);
        }

        if (current === 2) {
            return (stepContent as ServiceStepContent)(serviceData, handleUpdateSteps);
        }

        console.warn("Unknown step content");
        return null;
    };

    return (
        <Space
            style={{ width: "100%", padding: "0px 20px" }}
            direction="vertical"
        >
            <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
                Create New Service
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
                <Steps current={current} items={items} />
                <div style={{ padding: "16px", border: "1px dashed #ddd", marginTop: "16px"}}>
                    {renderContent()}
                </div>

                <div style={{ marginTop: 24 }}>
                    {current < steps.length - 1 && current !== 2 && (
                        <Button type="primary" onClick={next}>
                            Next
                        </Button>
                    )}
                    {current === 2 && (
                        <Button
                            type="primary"
                            onClick={handleCreateService}
                            loading={isPending}
                        >
                            Create
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: "0 8px" }} onClick={prev}>
                            Previous
                        </Button>
                    )}
                </div>
            </div>
        </Space>
    );
};

export default AddServiceScreen;