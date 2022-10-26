import React from 'react'
import Answer from './Answer.jsx'
import Helpful from './Helpful.jsx'
import {PropTypes} from 'prop-types'
import {QuestionFolder, AlignRight, IndividualQuestionStyle} from './assets/styles.js'
import AddAnswerModal from './AddAnswerModal.jsx'
import axios from 'axios'

const {useState, useEffect} = React;

const IndividualQuestion = ({renderQLength, question, index, shouldFetchQ, setShouldFetchQ, searchedQ, setEnableSearchQ}) => {



//State
// const [open, setOpen] = useState(false)
const [showAModal, setShowAModal] = useState(false)
const [questionId, setQuestionId] = useState(question.question_id)
const [shouldFetchA, setShouldFetchA] = useState(false);
const [open, setOpen] = useState(null)



//hooks & handlers
useEffect(()=>{
  if (searchedQ.length > 0) {
    console.log('length of searchedQ', searchedQ.length)
    setEnableSearchQ(true)
    setOpen(null)
  }
  if (searchedQ.length === 0) {
    setEnableSearchQ(false)
  }
}, [searchedQ])

const toggleOpen = () => {
  console.log(open)
  if(open === null) {

    setOpen(true)
  }
  setOpen(!open)
  setShouldFetchA(!shouldFetchA)
}

const openAModal = () => {
  setShowAModal(!showAModal)
}

const helpfulQuestionOnclick = (iD) => {

  const config = {params: {question_id: iD}}
  axios.put('/qa/questions/:question_id/helpful', {}, config)
  .then((success) => {
    setShouldFetchQ(!shouldFetchQ)
  })
  .catch((error) => {

  })

}

const reportQuestionOnclick = (iD) => {

  const config = {params: {question_id: iD}}
  axios.put('/qa/questions/:question_id/report', {}, config)
  .then((success) => {
    console.log('report success, fetching questions now')
    setShouldFetchQ(!shouldFetchQ)
  })
  .catch((error) => {

  })

}

//component
  return (
    <>
    <IndividualQuestionStyle className = 'individualQuestion' selectIndex={`${index}`} renderQLength={renderQLength}>
      <span className='question' onClick={toggleOpen}> <b>{`Q: ${question.question_body}`}</b></span>
      <AlignRight>
        <Helpful className='helpful'helpfulCount={question.question_helpfulness} id={question.question_id} helpfulHandler={helpfulQuestionOnclick} reportHandler={reportQuestionOnclick}/>
      </AlignRight>
      <QuestionFolder className={index} open={open}>
        <Answer questionid={question.question_id} shouldFetchQ={shouldFetchQ} setShouldFetchQ={setShouldFetchQ} openAModal={openAModal} shouldFetchA={shouldFetchA} searchedQ={searchedQ}/>
      </QuestionFolder>
    </IndividualQuestionStyle>
    {showAModal && <AddAnswerModal openAModal={openAModal} questionId={questionId} shouldFetchA={shouldFetchA} setShouldFetchA={setShouldFetchA}/>}
    </>
  )
}

//propTypes
IndividualQuestion.propTypes = {
  question: PropTypes.object,
  index: PropTypes.number,
  shouldFetchQ: PropTypes.bool,
  setShouldFetchQ: PropTypes.func

}
export default IndividualQuestion