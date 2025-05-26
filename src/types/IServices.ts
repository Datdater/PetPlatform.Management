export interface IServices {
    id: string;
    name: string;
    description: string;
    storeId: string;
    estimatedTime: string;
    serviceCategoryId: string;
    status: boolean;
}

export interface ServicesResponse {
    totalItemsCount: number;
    pageSize: number;
    totalPagesCount: number;
    pageIndex: number;
    next: boolean;
    previous: boolean;
    items: IServices[];
}

export interface PetServiceDetail {
    id: string | null;
    petWeightMin: number;
    petWeightMax: number;
    amount: number;
    petType: boolean;
    description: string;
    name: string;
}

export interface PetServiceStep {
    id: string | null;
    name: string;
    description: string;
    priority: number;
}

export interface IServiceDetailResponse {
    id: string | null;
    name: string;
    description: string;
    storeId: string;
    estimatedTime: string;
    serviceCategoryId: string;
    status: boolean;
    petServiceDetails: PetServiceDetail[];
    petServiceSteps: PetServiceStep[];
}

