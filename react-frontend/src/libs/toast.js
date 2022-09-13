import { toast } from 'react-toastify';

const options = {
  autoClose: 6000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_RIGHT,
  pauseOnHover: true,
};

export default {
  success: (message) => {
    toast.success(message, options);
  },
  info: (message) => {
    toast.info(message, options);
  },
  error: (message) => {
    toast.error(message, options);
  },
  warning: (message) => {
    toast.warn(message, options);
  },
};
