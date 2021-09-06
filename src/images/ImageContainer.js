import React from 'react'
import gql from 'graphql-tag';
import {useMutation} from "@apollo/react-hooks";
import DeleteConfirmation from "../views/helpers/deleteConfirmation";

/**
 * Mutation to delete an image from storage
 */
export const DELETE_IMAGE = gql`
    mutation(
        $publicId: String!
    ) {
        deleteImage(
            publicId: $publicId
        ) {
            publicId
        }
    }
`;

const ImageContainer = ({images, onlyImage, customDeleteMutation, onDeleteImage}) => {
  const [deleteImage, {loading}] = useMutation(DELETE_IMAGE, {onCompleted: onDeleteImage});

  if (loading)
    return <p>Eliminando...</p>

  return (
    <div style={{display: 'flex'}}>
      {images.map(({url, publicId}) => (
        url &&
        <div key={publicId}>
          <img src={url} alt={url} width={100} height={100}/>
          {
            !onlyImage &&
            <div>
              <DeleteConfirmation mutation={customDeleteMutation || deleteImage}
                                  variables={{publicId: publicId}}
                                  label='esta imagen'/>
            </div>
          }
        </div>
      ))}
    </div>
  );
}

export default ImageContainer;
