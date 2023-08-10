import { Sidebar } from '../components/Sidebar';
import { Menu } from '../components/Menu';
import { MenuItem } from '../components/MenuItem';
import "./index.css"
import { render, $, useEffect } from 'voby';
import { SubMenu } from '../components/SubMenu';
 
const App = () => {
    const collapsed = $(false)
    const toggled = $(false)
    const broken = $(window.matchMedia('(max-width : 800px)').matches)

    return (
      <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar collapsed={collapsed} >
        <Menu>
          <SubMenu prefix="🔥" suffix="🔥" icon={<img src={"C:\Users\hongo\Desktop\home.png"} />} label="Charts">
            <MenuItem icon={<img src={"C:\Users\hongo\Desktop\home.png"} />}> Pie charts</MenuItem>
            <MenuItem> Line charts</MenuItem>
            <MenuItem> Bar charts</MenuItem>
          </SubMenu>
          <SubMenu label="Maps">
            <MenuItem> Google maps</MenuItem>
            <MenuItem> Open street maps</MenuItem>
          </SubMenu>
          <SubMenu label="Theme">
            <MenuItem> Dark</MenuItem>
            <MenuItem> Light</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
          <main style={{ padding: 10 }}>
                 <div>
                     <button onClick={() => collapsed(!collapsed())}>
                         Collapse
                     </button>
                 </div>
             </main>
    </div>


    //   RTL Demo
    //   <div
    //   style={{
    //     display: 'flex',
    //     height: '100%',
    //     minHeight: '400px',
    //     direction: 'rtl',
    //   }}
    // >
    //   <Sidebar rtl  collapsed={collapsed}>
    //     <Menu>
    //       <MenuItem> Documentation</MenuItem>
    //       <MenuItem> Calendar</MenuItem>
    //       <MenuItem> E-commerce</MenuItem>
    //       <MenuItem> Examples</MenuItem>
    //     </Menu>
    //   </Sidebar>
    //      <main style={{ display: 'flex', padding: 10 }}>
    //        <div>
    //          <button className="sb-button" onClick={() => collapsed(!collapsed())}>
    //            Collapse
    //          </button>
    //        </div>
    //      </main>
    // </div>
      //Image Demo
    //   <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
    //   <Sidebar image="https://i.pinimg.com/736x/8e/6c/06/8e6c064f57f94838263d7ba9ad80f353.jpg">
    //     <Menu>
    //       <MenuItem> Documentation</MenuItem>
    //       <MenuItem> Calendar</MenuItem>
    //       <MenuItem> E-commerce</MenuItem>
    //       <MenuItem> Examples</MenuItem>
    //     </Menu>
    //   </Sidebar>
    // </div>

      // Toggle background blur and display menu
      //   <div style={{ display: 'flex', height: '100%', minHeight: '400px'   }}>
      //   <Sidebar onBackdropClick={() => toggled(false)} toggled={toggled} breakPoint="all" >
      //     <Menu>
      //       <MenuItem> Documentation</MenuItem>
      //       <MenuItem> Calendar</MenuItem>
      //       <MenuItem> E-commerce</MenuItem>
      //       <MenuItem> Examples</MenuItem>
      //     </Menu>
      //   </Sidebar>
      //   <main style={{ display: 'flex', padding: 10 }}>
      //     <div>
      //       <button className="sb-button" onClick={() => toggled(!toggled())}>
      //         Toggle
      //       </button>
      //     </div>
      //   </main>
      // </div>

      //Collapsed demo
        // <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
        //     <Sidebar collapsed={collapsed} transitionDuration={5000} >
        //         <Menu>
        //             <MenuItem onClick={()=>console.log("Documentation")}> Documentation</MenuItem>
        //             <MenuItem> Calendar</MenuItem>
        //             <MenuItem> E-commerce</MenuItem>
        //             <MenuItem> Examples</MenuItem>
        //         </Menu>
        //     </Sidebar>
        //     <main style={{ padding: 10 }}>
        //         <div>
        //             <button onClick={() => collapsed(!collapsed())}>
        //                 Collapse
        //             </button>
        //         </div>
        //     </main>
        // </div>
    )

}

render(App, document.body)
