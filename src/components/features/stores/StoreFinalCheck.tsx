import { AiOutlineCheckCircle } from "react-icons/ai";
import { colors } from "../../../constants/colors";

const StoreFinalCheck = () => {
  return (
    <div style={{ textAlign: "center", padding: "40px 0px" }}>
      <AiOutlineCheckCircle size={100} color={colors.green} />
      <h2 style={{ color: colors.gray800 }}>Cảm ơn bạn đã đăng ký cửa hàng</h2>
      <p style={{ color: colors.gray800 }}>
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
      </p>
    </div>
  );
};

export default StoreFinalCheck;
