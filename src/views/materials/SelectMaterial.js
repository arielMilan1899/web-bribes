import React, {useState} from "react";
import {CCol, CFormGroup, CInputCheckbox, CLabel} from "@coreui/react";


const SelectMaterial = ({materials, onMaterialSelected, preSelectedMaterials = []}) => {
  const [currentMaterials, setCurrentMaterials] = useState(preSelectedMaterials)

  const handleSelectMaterial = ({id}) => {
    const selectedMaterials = currentMaterials.concat([id])
    setCurrentMaterials(selectedMaterials)
    onMaterialSelected(selectedMaterials)
  }
  const handleDeselectMaterial = ({id}) => {
    const selectedMaterials = currentMaterials.filter((item) => (item !== id))
    setCurrentMaterials(selectedMaterials)
    onMaterialSelected(selectedMaterials)
  }

  return (
    <CFormGroup row>
      <CCol md="3">
        <CLabel>Materiales</CLabel>
      </CCol>
      <CCol md="9">
        {materials.length === 0 && <p>No se han agregado materiales.</p>}
        {
          materials.map((material) => (
            <CFormGroup key={material.id}
                        variant="custom-checkbox" inline>
              <CInputCheckbox custom
                              id={material.id}
                              name={material.id}
                              value={material.id}
                              checked={currentMaterials.includes(material.id)}
                              onChange={(event) => (event.target.checked ?
                                handleSelectMaterial(material) :
                                handleDeselectMaterial(material))}
              />
              <CLabel variant="custom-checkbox" htmlFor={material.id}>{material.title.es}</CLabel>
            </CFormGroup>
          ))
        }
      </CCol>
    </CFormGroup>
  )
}

export default SelectMaterial;
