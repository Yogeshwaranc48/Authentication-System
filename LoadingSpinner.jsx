const LoadingSpinner = ({ fullPage = false, message = 'Loading...' }) => {
  const content = (
    <div className="loading-spinner">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );

  if (fullPage) {
    return <div className="loading-page">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
