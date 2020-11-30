import React from "react";
import { Calendar, Divider, Empty, Menu } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import "antd/dist/result.css";
import style from "../../../css/calendar-form.module.css";

const { SubMenu } = Menu;

function onSelectSlot(item) {
  // get the selected doctor & time slot
  let x,
    y,
    num = 0;
  const key = parseInt(item.key);
  data.forEach((e, i) => {
    num++;
    e[1].forEach((se, si) => {
      num++;
      console.log(num);
      if (num === key) {
        console.log("matched");
      }
    });
  });
}

function onSelectDate(item) {
  const date = item._d;
  console.log(date);
}

function CalendarForm(props) {
  // specify the list of time slots here
  let num = 0;
  const data = props.timeSlots;
  return (
    <div className={style["calendar-form-wrapper"]}>
      <div className={style["date-container"]}>
        <Calendar fullscreen={false} onSelect={onSelectDate} />
        <Divider orientation="center" style={{ color: "#202020" }}>
          Available Slots
        </Divider>
      </div>
      <div className={style["timeslots-container"]}>
        
        {data[0] === -1 ? (
          // display empty if there is no available time slot
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={<span>No available time slot today</span>}
          ></Empty>
        ) : (
          <Menu
            multiple={false}
            defaultSelectedKeys={["1"]}
            mode={"inline"}
            theme={"light"}
            onClick={onSelectSlot}
          >
            {data.map((e, i) => {
              num++;
              return (
                <SubMenu key={num} title={e[0]} icon={<CalendarOutlined />}>
                  {e[1].map((se, si) => {
                    num++;
                    return <Menu.Item key={num}>{se}</Menu.Item>;
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        )}
      </div>
    </div>
  );
}

export default CalendarForm;
