export const getVerdictColor = (verdict) => {
  switch (verdict) {
    case 'likely_real':
      return 'text-green-600 bg-green-50';
    case 'uncertain':
      return 'text-yellow-600 bg-yellow-50';
    case 'suspicious':
      return 'text-orange-600 bg-orange-50';
    case 'likely_fake':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getVerdictLabel = (verdict) => {
  return verdict.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const getSignalColor = (value) => {
  switch (value) {
    case 'natural':
    case 'acceptable':
      return 'text-green-600 bg-green-100';
    case 'inconsistent':
      return 'text-orange-600 bg-orange-100';
    case 'highly_suspicious':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};