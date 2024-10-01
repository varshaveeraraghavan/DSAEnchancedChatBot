// import React from 'react';
// import './toggleSwitch.css';

// const ToggleSwitch = ({ checked, onChange }) => {
//   const handleToggle = (e) => {
//     onChange(e.target.checked);
//   };

//   return (
//     <div className='toggle-switch'>
//       <span className="toggle-label">DSABot</span>
//       <label className="slider" style={{ marginBottom: '-10px' }}>
//         <input type="checkbox" checked={checked} onChange={handleToggle} />
//         <span className="slider-round"></span>
//       </label>
//       <span className="toggle-label">DocBot</span>
//     </div>
//   );
// };

// export default ToggleSwitch;
import React from 'react';
import './toggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, clearChat }) => {
  const handleToggle = (e) => {
    onChange(e.target.checked);
    clearChat();
  };

  return (
    <div className='toggle-switch'>
      <span className="toggle-label">DSABot</span>
      <label className="slider" style={{ marginBottom: '-10px' }}>
        <input type="checkbox" checked={checked} onChange={handleToggle} />
        <span className="slider-round"></span>
      </label>
      <span className="toggle-label">DocBot</span>
    </div>
  );
};

export default ToggleSwitch;
