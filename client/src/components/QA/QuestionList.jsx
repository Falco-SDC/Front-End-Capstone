import React from 'react';
import axios from 'axios';
import {Accordion, Wrapper, SearchBarStyle, ModalButton, ModalStyle, QuestionListStyle, QListWrapper} from './assets/styles.js'
import {PropTypes} from 'prop-types'
import IndividualQuestion from './IndividualQuestion.jsx'
import SearchBar from './SearchBar.jsx'
import LoadMoreQs from './LoadMoreQs.jsx'
import Modal from './AddQuestionModal.jsx'
import AddQuestion from './AddQuestion.jsx'
import AddAnswerModal from './AddAnswerModal.jsx'
import {interactionContext} from '../App.jsx'

const { useState, useEffect, useContext } = React;

const QuestionList = ({productID}) => {

  //Local Variables
  const start = 0;
  const endStart = 4;

  // States
  const [end, setEnd] = useState(endStart)
  const [productId, setProductId] = useState(productID)
  const [renderQ, setRenderQ] = useState([])
  const [questions, setQuestions] = useState([])
  const [searchedQ, setSearchedQ] = useState([])
  const [hide, setHide] = useState(true)
  const [enableSearchQ, setEnableSearchQ] = useState(false)
  const [showQModal, setShowQModal] = useState(false)
  const [shouldFetchQ, setShouldFetchQ] = useState(false)

  //data-tracking
  const postInteraction = useContext(interactionContext)
  const currentComponent = 'QA';
  let currentTime = new Date()

  // Hooks & Handler
  useEffect(()=> {

    //axios.get('/qa/questions', {params: {product_id: productID, count: 100}})
    axios.get('localhost:3001/qa/questions', {params: {product_id: productID, count: 100}})
    .then((res)=>{
      console.log('setting questions')
      if (res.data.results.length <= 4) {
        setHide(false)
      }
      setQuestions(res.data.results)
      setRenderQ(res.data.results.slice(start, end))
    })
    .catch((error)=>{
      console.error(error)
    })

  }, [productID, shouldFetchQ, searchedQ])

  useEffect(()=>{

    if (end !== endStart && end >= questions.length) {
      setHide(false);
    }

  }, [end])

  const loadMore = (e) => {

    postInteraction(e.target.id, currentComponent, currentTime);
    if (renderQ.length <= questions.length) {

      let newEnd = end + 2
      let newResults = questions.slice(start, newEnd)
      setEnd(newEnd)
      setRenderQ(newResults)
    }
  }

  const openQModal = () => {
    setShowQModal(!showQModal)
  }

  //component
  return (
    <QuestionListStyle className='qListStyle'>
      { showQModal ? <Modal openQModal={openQModal} productId={productId} setProductId={setProductId} setShowQModal={setShowQModal} shouldFetchQ={shouldFetchQ} setShouldFetchQ={setShouldFetchQ}/> : <></>}
        <h2 className ='Title'> QUESTIONS & ANSWERS </h2>
        <SearchBar questions={questions} setRenderQ={setRenderQ} renderQ={renderQ} searchedQ={searchedQ} setSearchedQ={setSearchedQ} enableSearchQ={enableSearchQ} setEnableSearchQ={setEnableSearchQ}/>
      <QListWrapper>
        <Wrapper className ='accordionWrapper'>
          <Accordion>
            <div className="Accordion" data-testid="accordian">
              {enableSearchQ ? searchedQ.map(function(question, index) {
                return (
                  <IndividualQuestion data-testid='IQ' renderQLength={renderQ.length-1} key={index} question={question} open={open} index={index} shouldFetchQ={shouldFetchQ} setShouldFetchQ={setShouldFetchQ} searchedQ={searchedQ} setEnableSearchQ={setEnableSearchQ} />
                )
              }) : renderQ.map(function(question, index) {
                return (
                  <IndividualQuestion data-testid="IQ" renderQLength={renderQ.length-1} key={index} question={question} open={open} index={index} shouldFetchQ={shouldFetchQ} setShouldFetchQ={setShouldFetchQ} searchedQ={searchedQ} setEnableSearchQ={setEnableSearchQ} />
                )
              })}
            </div>
          </Accordion>
        </Wrapper>
      </QListWrapper>
      <AddQuestion className='AddQuestion' loadMore={loadMore} openQModal={openQModal}/>
      {hide ? <LoadMoreQs className='LoadMore' loadMore={loadMore}/> : <></>}
    </QuestionListStyle>
  )
}

//propTypes
QuestionList.propTypes = {
  productID: PropTypes.number
}

export default QuestionList;