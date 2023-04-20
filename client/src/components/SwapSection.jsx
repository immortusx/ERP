import React, { useMemo, useState, useEffect, useRef } from 'react'

export default function SwapSection({ selectionData, callBackFun, currentId, selectedData, setSelectedData }) {
    const selectInp = useRef()
    const selectedInp = useRef()
    const leftArrowBtn = useRef()
    const rightArrowBtn = useRef()


    const getNameOfSelection = useMemo((id) => {
        const resultAr = [];

        if (selectedData[currentId] != undefined) {
            Array.from(selectedData[currentId]).forEach((item) => {
                const result = selectionData.find(i => {
                    return i.id == item
                })
                resultAr.push(result)
            })
        }
        return resultAr
    }, [selectedData])


    function makeSelected(e, side, item) {
        if (side === 'rightSide') {
            rightArrowBtn.current.classList.remove('disabledBtn')
            Array.from(selectInp.current.childNodes).forEach(i => {
                i.classList.remove('checked')

            })
        } else {
            leftArrowBtn.current.classList.remove('disabledBtn')
            Array.from(selectedInp.current.childNodes).forEach(i => {
                i.classList.remove('checked')

            })
        }
        e.target.classList.add('checked')
    }

    async function rightClick() {
        let tempAr = []
        const itemList = selectInp.current
        const selectedItems = itemList.getElementsByClassName('checked');
        const checkId = selectedItems[0].value

        await callBackFun(checkId)

        rightArrowBtn.current.classList.add('disabledBtn')
    }

    function leftClick() {
        console.log('selectedData', selectedData)
        console.log('currentId', currentId)

        const itemList = selectedInp.current

        const selectedItems = itemList.getElementsByClassName('checked');

        console.log('selectedItems', selectedItems);
        const checkId = selectedItems[0].value
        console.log('checkId', checkId);
        const tempAr = selectedData[currentId]
        const newAr = tempAr.filter(i => { return i != checkId })
        console.log('tempAr', tempAr.filter(i => { return i != checkId }));

        setSelectedData(selectedData => ({ ...selectedData, [currentId]: newAr }))

        selectedInp.current.value = 0
        leftArrowBtn.current.classList.add('disabledBtn')
    }





    return (
        <div className='swapSelection d-flex flex-column flex-md-row mt-2'>
            <main>
                <label className='pb-2' >Available Roles ({selectionData && selectionData.length > 0 ? selectionData.length : 0})</label>
                <ul ref={selectInp} name='selectRole' className='inputElement'>
                    {
                        selectionData.length > 0 && selectionData.map((item, index) => {
                            return <li onClick={(event) => { makeSelected(event, 'rightSide', item) }} className='text-uppercase' key={index} value={item.id}>{item.name || item?.role}</li>
                        })
                    }
                </ul>
            </main>

            <div className='d-flex flex-row flex-md-column justify-content-around allBtnsMain m-3'>
                <div ref={rightArrowBtn} className='arrowBtn disabledBtn' name='rightDiv' onClick={() => { rightClick() }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                    </svg>
                </div>
                <div ref={leftArrowBtn} className='arrowBtn disabledBtn' onClick={leftClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </div>
            </div>

            <main >
                <label className='pb-2' >Selected ({selectedData[currentId] && selectedData[currentId].length > 0 ? selectedData[currentId].length : 0})</label>
                <ul ref={selectedInp} className='inputElement' name='selectedRole'>
                    {
                        getNameOfSelection.map((item, index) => {

                            return <li onClick={(event) => { makeSelected(event, 'leftSide', item) }} className='text-uppercase' value={item.id} key={index} >{item.role}</li>
                        })
                    }
                </ul>
            </main>
        </div>
    )
}
