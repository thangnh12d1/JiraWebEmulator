import React, { useEffect ,useState } from 'react';
import { useAppDispatch } from '../store'
import { fetchStatuss, statussSelector,setState  } from '../slices/statuss'
import { useSelector } from 'react-redux'
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';

import initialElements from './initial-elements';

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const arrayInput = [{id: '',
type: 'input', 
data:{
  label:(
    <>
      Welcome to <strong>React Flow!</strong>
    </>
  ),
},
position:{x:  100 + Math.random() * (100 - 0), y: 100 + Math.random() * (100 - 0)}
}]

console.log(arrayInput)
const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  let temp = JSON.parse(localStorage.getItem('TransitionAll') || '[]' )
  console.log(elements)
  console.log(temp)
  const dispatch = useAppDispatch()
  const { updateMess, updateSuccess,statuss, loading, hasErrors } = useSelector(statussSelector)
  useEffect(() => {
    dispatch(fetchStatuss())
  }, [dispatch])
  console.log(statuss)
  
  let arrTran = [] 
  let arrStatus = [] 
  temp.map((i) =>{
      arrTran.push({
        id: i.TransitionId,
        source: i.Status1Id,
        target: i.Status2Id,
        type: 'step',
        arrowHeadType: 'arrowclosed',
        animated: true,
        label: i.TransitionName,
      })
  })
  statuss.map((i) =>{
    arrStatus.push({
      id: i.StatusId,
      type: (i.StatusName == "TO DO")? 'input' : (i.StatusName == "DONE") ? 'output' : 'default',
      data: {
        label:(
          <>
          <strong>{i.StatusName}</strong>
          </>
        )
      },
      style: (i.StatusName == "TO DO")? {
        background: '#D6D5E6',
        color: '#333',
        border: '1px solid #222138',
        width: 180,
        
      } : (i.StatusName == "DONE")? { 
        background: '#228629',
        color: '#FFFFFF',
        border: '1px solid #222138',
        width: 180,} : {
        background: '#1F35DC',
        color: '#FFFFFF',
        border: '1px solid #222138',
        width: 180,
        },
      position: (i.StatusName == "TO DO")? {x:10, y: 100}: (i.StatusName == "DONE")? {x:750,y: 300}:{x:  100 + (Math.random()) * (100 - 0), y: 100 + Math.random() * (100 - 0)}
    })
  })
  console.log(Math.random())
  console.log(arrTran)
  console.log(arrStatus)
  let arr = arrStatus.concat(arrTran)
  return (
    <ReactFlow
      elements={arr}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[15, 15]}
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#1a192b';
          if (n.type === 'output') return '#33FF41';
          if (n.type === 'default') return '#3344FF';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;