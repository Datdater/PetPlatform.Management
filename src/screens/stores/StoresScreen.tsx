import {
  Button,
  Drawer,
  Flex,
  Space,
  Spin,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router";
import useFetchStores from "../../hooks/store/useFetchStores";
import { IStore } from "../../types/IStore";
import StoreDetail from "../../components/features/stores/StoreDetail";
import { useQueryClient } from "@tanstack/react-query";

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
//   tags: string[];
// }

// const data: DataType[] = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     tags: ["nice", "developer"],
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     tags: ["loser"],
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//     tags: ["cool", "teacher"],
//   },
// ];

const StoresScreen = () => {
  const columns: TableProps<IStore>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Hotline",
      dataIndex: "hotline",
      key: "hotline",
    },
    {
      title: "Business Type",
      dataIndex: "businessType",
      key: "businessType",
    },
    {
      title: "Fax Code",
      dataIndex: "faxCode",
      key: "faxCode",
    },
    {
      title: "Fax Email",
      dataIndex: "faxEmail",
      key: "faxEmail",
    },
    // {
    //   title: "Tags",
    //   key: "tags",
    //   dataIndex: "tags",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (store: IStore) => (
        <Space size="middle">
          <a onClick={() => showLoading(store.id)}>View</a>
        </Space>
      ),
    },
  ];
  const [openViewDrawer, setOpenViewDrawer] = useState<boolean>(false);
  // const [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState<boolean>(false);

  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showLoading = (id: string) => {
    setOpenViewDrawer(true);
    setIsDrawerLoading(true);
    setSelectedStoreId(id);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setIsDrawerLoading(false);
    }, 500);
  };

  useEffect(() => {
    document.title = "Store Management";
  }, []);

  const {
    data: storeResponse,
    isLoading,
    isError,
    isFetching,
  } = useFetchStores();

  return (
    <>
      <Space
        style={{ width: "100%", padding: "0px 20px" }}
        direction="vertical"
      >
        <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
          Store Management
        </Typography>
        {/* <Space
          style={{
            backgroundColor: colors.white,
            width: "100%",
            borderRadius: 10,
            padding: 20,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Filter</h3>
        </Space> */}

        <div
          style={{
            backgroundColor: colors.white,
            width: "100%",
            borderRadius: 10,
            padding: "10px 20px",
            marginTop: 20,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Flex justify="space-between" align="center">
            <h3>Stores List</h3>
            <div>
              <Button
                type="primary"
                style={{ marginLeft: "auto", marginRight: 10 }}
                icon={<AiOutlinePlus />}
                onClick={() => navigate("/stores/add-store", { replace: true })}
              >
                Add Store
              </Button>
              <Tooltip title="Reload">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<AiOutlineReload />}
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["stores"] });
                  }}
                />
              </Tooltip>
            </div>
          </Flex>
          {isLoading && <Spin />}
          {isError && <p>Something went wrong</p>}
          <Spin spinning={isFetching}>
            <Table<IStore>
              columns={columns}
              dataSource={storeResponse?.items}
              style={{ width: "100%" }}
            />
          </Spin>
        </div>
      </Space>
      <Drawer
        closable
        destroyOnClose
        title={<p>Store detail</p>}
        placement="right"
        open={openViewDrawer}
        loading={isDrawerLoading}
        onClose={() => setOpenViewDrawer(false)}
        width={600}
      >
        {/* <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={showLoading}
        >
          Reload
        </Button> */}
        {selectedStoreId && <StoreDetail id={selectedStoreId} />}
      </Drawer>
    </>
  );
};

export default StoresScreen;
