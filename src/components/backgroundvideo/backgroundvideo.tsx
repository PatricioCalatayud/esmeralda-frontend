import React from 'react';

const BackgroundVideo = () => {
  return (
    <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
      <source src="/roaster.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;