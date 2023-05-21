import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';
type Block = {
  path: string;
  cmd: string;
  res: string;
};
const App = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const onCmdInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newBlocks = [...blocks];
    newBlocks[index].cmd = event.target.value;
    setBlocks(newBlocks);
  };
  const onKeyEnterDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === 'Enter') {
      if (blocks[index].path === '' || blocks[index].cmd === '') {
        return;
      }
      invoke('exec', { value: blocks[index].cmd }).then((res) => {
        let newBlocks = [...blocks];
        newBlocks[index].res = res as string;
        newBlocks.push({
          path: blocks[blocks.length - 1].path,
          cmd: '',
          res: '',
        });
        setBlocks(newBlocks);
      });
    }
  };
  useEffect(() => {
    invoke('exec', { value: 'whoami' }).then((res) => {
      setBlocks([{ path: `${res} % `, cmd: '', res: '' }]);
    });
  }, []);
  return (
    <div className='container'>
      {blocks.map((block, index) => {
        return (
          <div key={index}>
            <div className='row'>
              <div>{block.path}</div>
              <input
                onKeyDown={(event) => onKeyEnterDown(event, index)}
                value={block.cmd}
                onChange={(event) => onCmdInput(event, index)}
              />
            </div>
            <div className='row'>
              <div>{block.res}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
