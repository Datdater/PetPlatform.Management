import { Image, Spin } from "antd";
import { useFetchStore } from "../../../hooks/store/useFetchStore";

type StoreDetailProps = {
  id: string;
};

const StoreDetail = ({ id }: StoreDetailProps) => {
  const { data: store, isLoading, error } = useFetchStore(id);

  if (isLoading) {
    return <Spin />;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <h1>{store?.name}</h1>
      <div>
        <h3>Hotline: </h3>
        <p> {store?.hotline}</p>
      </div>
      <h3>Logo Cửa hàng</h3>
      <Image src={store?.logoUrl} alt="Store logo" />
      <h3>Banner Cửa hàng</h3>
      <Image src={store?.bannerUrl} alt="Store banner" />
      <h3>Fax email</h3>
      <p>{store?.faxEmail}</p>
      <h3>Fax code</h3>
      <p>{store?.faxCode}</p>

      <h3>Mặt trước CCCD</h3>
      <Image src={store?.frontIdentityCardUrl} alt="Front identity card" />
      <h3>Mặt sau CCCD</h3>
      <Image src={store?.backIdentityCardUrl} alt="Back identity card" />
    </>
  );
};

export default StoreDetail;
