import React, { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone: FC<{ onUpload: (picture: any) => void }> = ({
  children,
  onUpload,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];
    onUpload(image);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default Dropzone;