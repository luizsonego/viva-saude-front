import React, { useRef, useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Button } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUploadAnexo } from "../../hooks/post/usePost.query";
import { useResourcePut } from "../../hooks/update/useUpdate.query";

const Upload = ({
  title,
  id,
  label,
  folder,
  controller,
  action,
  callback,
  ...props
}) => {
  const publicKey = "public_+CkIRGN5XL12KtmQCOzaDedsveU=";
  const urlEndpoint = "https://ik.imagekit.io/krf4f8xfq";
  // const authenticationEndpoint = `${process.env.REACT_APP_API}/v1/site/auth`;

  const { mutateAsync, isPending } = useResourcePut(
    "update",
    "anexo",
    () => {}
  );

  const onError = (err) => {
    // console.log("error: ", err);
    // setUploadError(true);
    // setStartUpload(false);
  };

  const onSuccess = (res) => {
    const anexos = res.url;
    const dataDocument = {
      anexos,
      id,
    };
    mutateAsync(dataDocument);
  };

  const onUploadStart = (evt) => {
    // setStartUpload(true);
  };

  const onUploadProgress = (event) => {
    const percent = Math.floor((event.loaded / event.total) * 100);
    // setProgress(percent);
    // setUploadError(false);
    // setUploadSuccess(false);
    // if (percent === 100) {
    //   setProgress(0);
    // }
  };
  const authenticator = async () => {
    try {
      // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
      const headers = {
        Authorization: "Bearer your-access-token",
        CustomHeader: "CustomValue",
      };
      const response = await fetch(
        `${process.env.REACT_APP_API}/v1/site/auth`,
        {
          headers,
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };
  return (
    <>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <IKUpload
          fileName={`${btoa(title)}-${id}`}
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={false}
          folder={"/anexo"}
          onUploadStart={onUploadStart}
          onUploadProgress={onUploadProgress}
        />
      </IKContext>
    </>
  );
};

export default Upload;
