export interface IServices {
    id: string;
    name: string;
    description: string;
    image: string;
    storeId: string;
    estimatedTime: string;
    serviceCategoryId: string;
    basePrice: number;
    storeCity: string;
    storeDistrict: string;
    totalUsed: number;
    totalReviews: number;
    ratingAverage: number;
    status: boolean;
    storeName: string;
    categoryName: string;
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
    id: string;
    name: string;
    description: string;
    basePrice: number;
    storeCity: string;
    storeDistrict: string;
    totalUsed: number;
    ratingAverage: number;
    totalReviews: number;
    image: string;
    storeId: string;
    estimatedTime: string;
    serviceCategoryId: string;
    status: boolean;
    serviceCategoryName: string;
    petServiceDetails: PetServiceDetail[];
    petServiceSteps: PetServiceStep[];
}

export interface IServiceReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

