import React from 'react'
import styled from 'styled-components'
import {PropTypes} from 'prop-types'
import {ModalBackground, ModalStyle, ModalWrapper, ModalContent, CloseModalButton, ModalForm} from './assets/styles.js'
import axios from 'axios'


const {useState, useRef} = React;

const Modal = ({openQModal, productId, setProductId, setShowQModal, shouldFetchQ, setShouldFetchQ}) => {

  //state & refs
  const questionRef = useRef(null)
  const nicknameRef = useRef(null)
  const emailRef = useRef(null)

  //handler & helpers
  const newPostObj = (question, nickname, email, productID, shouldFetchQ, setShouldFetchQ) => {
    const dataObj = {
      body: question,
      name: nickname,
      email: email,
      product_id: productID
    }
    return dataObj;
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataObj = newPostObj(questionRef.current.value, nicknameRef.current.value, emailRef.current.value, parseInt(productId))

    //axios.post('/qa/questions', dataObj)
    axios.post('localhost:3001/qa/questions', dataObj)
    .then((res)=>{
      setShowQModal(false)
      setShouldFetchQ(!shouldFetchQ)
    })
    .catch((err)=>{

    })

  }

  //component
  return (
    <>
        <ModalBackground>
          <ModalWrapper>
            <ModalContent className = 'modalForm'>
              <h2 className='modalheader'>Have a Question?</h2>
              <ModalForm onSubmit={(e) => {handleSubmit(e)}}  >
                <label data-testid='modalform' className='formSpan'>Your Question *</label>
                <textarea data-testid='modalform'type='text' className='formTextArea' maxLength='1000' ref={questionRef} required='required'></textarea>
                <label data-testid='modalform'className='formSpan'>Your Nickname *</label>
                <input data-testid='modalform'type='text' className='formInput'  maxLength='60' placeholder='Example: WickedCool1337' ref={nicknameRef} required='required'></input>
                <label data-testid='modalform'className='formSpan'placeholder>Your Email *</label>
                <input data-testid='modalform'type='text' className='formInput'  maxLength='60' placeholder='Why did you like the product?' ref={emailRef} required='required'></input>
                <label data-testid='modalform'className='finalSpan'>For authentication reasons, you will not be emailed</label>
                <button data-testid='modalform'className='submit'>Submit</button>
              </ModalForm>
            </ModalContent>
            <CloseModalButton aria-label='Close modal' onClick={openQModal}/>
          </ModalWrapper>
        </ModalBackground>
    </>
  )
}

//proptypes
Modal.propTypes = {
  openQModal: PropTypes.func,
  productId: PropTypes.string,
  setProductId: PropTypes.func,
  setShowQModal: PropTypes.func,
  shouldFetchQ: PropTypes.bool,
  setShouldFetchQ: PropTypes.func,
}

export default Modal;



