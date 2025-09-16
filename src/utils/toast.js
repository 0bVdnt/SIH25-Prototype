import { toast } from 'react-toastify';

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },
  
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },
  
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },
  
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options
    });
  },
  
  update: (toastId, options) => {
    toast.update(toastId, options);
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};

// Utility for custom toast with HTML content
export const showCustomToast = (content, type = 'default', options = {}) => {
  toast(content, {
    type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};