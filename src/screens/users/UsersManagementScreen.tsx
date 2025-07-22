import { Typography, Table, Input, Space, Card, Tag } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

const providedData = [
  ["alicewang1910@gmail.com", "Dương Ngọc Minh Thảo", "0941324959"],
  ["datnhothuong@gmail.com", "Nguyen Quoc Dat", "0364341107"],
  ["datsunsiu@gmail.com", "dathlecnx", "0364341107"],
  ["hmphuoc63@gmail.com", "Huỳnh Minh Phước", "0823871955"],
  ["hoangphamthuytien8080@gmail.com", "Thủy Tiên", "0348000948"],
  ["minhquandoanngoc@gmail.com", "Đoàn Ngọc Minh Quân", "0934177280"],
  ["phungnttss170786@fpt.edu.vn", "Thanh Phung", "0911299717"],
  ["narcissusfairy8@gmail.com", "Đan Linh", "0978915087"],
  ["hoangdn1309@gmail.com", "hoaa", "0987654333"],
  ["khanhvy16062003@gmail.com", "Nguyễn thị khánh vy", "0816218226"],
  ["datqquocnguyen@gmail.com", "Nguyen Quoc Dat", "0364341107"],
  ["nguyenthanhthuy0553@gmail.com", "Thanh Thuý", "0988869084"],
  ["anhdtnse172088@fpt.edu.vn", "Đặng Thị Ngọc Ánh", "0981436203"],
  ["bichf@gmail.com", "bsdfjfds", "0974637453"],
  ["haiyenbui143@gmail.com", "Bùi Hải Yến", "0797275236"],
  ["hungdmse173190@fpt.edu.vn", "Đoàn Mạnh Hùng", "0368214667"],
  ["phuongshin05032000@gmail.com", "Tran Phuong", "0368751591"],
  ["bichphuongbui2021@gmail.com", "bichphuongbui", "0909059993"],
  ["anh418073@gmail.com", "Nguyễn Thị Ngọc Ánh", "0858553339"],
  ["vohoanganh8606@gmail.com", "Anh", "0364337886"],
  ["phuonglnss171146@fpt.edu.vn", "Lê Nguyên Phương", "0908083396"],
  ["AnhNTLSS170762@fpt.edu.vn", "Kate Nguyen", "0964433064"],
  ["thanhthao22102003@icloud.com", "Nguyễn lê thanh thảo", "0939952421"],
  ["hoaitranchau0@gmail.com", "Châu Hoài Trân ", "0349008154"],
  ["Quynhvlm2003@gmail.com", "Hồ Thuý Quỳnh", "0778105194"],
  ["keokobayashi@gmail.com", "Trần Nguyễn Ngọc Nhung", "0395471522"],
  ["AnhVNLSS170606@fpt.edu.vn", "Lan Anh", "0986762530"],
  ["luciennguyen1911@gmail.com", "Nguyễn Hữu Thái", "0904740730"],
  ["tienhoang442@gmail.com", "siu123", "0987654322"],
  ["tphamthithom0420@gmail.com", "Phạm Thơm", "0388890106"],
  ["Thanhlvtss170749@fpt.edu.vn", "Lăng Vũ Trọng Thành ", "0387904268"],
  ["DatNQSE173081@fpt.edu.vn", "Nguyen Quoc Dat", "0364341199"],
  ["nguyenthithanhtuyen30100@gmail.com", "Thanh Tuyền", "0962500518"],
  ["benzminh2003@gmail.com", "Hoàng Lê Nhật Minh", "0902855644"],
  ["dongan06022000@gmail.com", "Đồng Ân", "0969334875"],
  ["bichphuongbui2015@gmail.com", "string", "0964637643"],
  ["phuochmse171830@fpt.edu.vn", "Huỳnh Minh Phước", "0823871955"],
  ["lylkss171306@fpt.edu.vn", "Lê Khánh Ly", "0798886336"],
  ["trihoangnguyenn@gmail.com", "Tri Hoàng", "0783322175"],
  ["chinhhung259@gmail.com", "Nguyễn Chính Hưng", "0969630535"],
  ["bagadeptrai33@gmail.com", "CutePet", "1234567890"],
  ["kieuhlnss171296@fpt.edu.vn", "Cìu nè", "0708555703"],
  ["hangdttss180637@fpt.edu.vn", "Đặng Thị Thúy Hằng", "0389937278"],
  ["ynhinguyen214@gmail.com", "Ý Nhi", "0868208486"],
  ["thanhphupt555@gmail.com", "Nguyễn Thành Phú", "0326155605"],
  ["vieth7391@gmail.com", "Huỳnh Phạm Lê Nguyễn Việt Hà", "0977697655"],
  ["baongse172137@fpt.edu.vn", "Nguyễn Gia Bảo", "0931891730"]
];

const fakeUsers = providedData.map((item, idx) => ({
  id: (idx + 1).toString(),
  email: item[0],
  name: item[1],
  phone: item[2],
  address: `${Math.floor(Math.random()*1000)+1} Đường Số ${Math.floor(Math.random()*50)+1}, Q.${(idx%12)+1}, TP.HCM`,
  status: Math.random() > 0.15 ? 1 : 0,
  orders: Math.floor(Math.random()*20),
  bookings: Math.floor(Math.random()*10),
}));

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Tên', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: 'Địa chỉ', dataIndex: 'address', key: 'address', width: 220 },
  { title: 'Tổng đơn hàng', dataIndex: 'orders', key: 'orders', width: 120 },
  { title: 'Tổng lịch hẹn', dataIndex: 'bookings', key: 'bookings', width: 120 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120, render: (status: number) => status === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khoá</Tag> },
];

const UsersManagementScreen = () => {
  const [search, setSearch] = useState('');
  const filteredUsers = fakeUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search) ||
    u.address.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý người dùng</Title>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm người dùng" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </Space>
      </Card>
      <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default UsersManagementScreen; 