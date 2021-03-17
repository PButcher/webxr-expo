const CS_EXPO_URL =
  "https://csee.bangor.ac.uk/expo/wp-content/uploads/cspostersvr.json";
const EE_EXPO_URL =
  "https://csee.bangor.ac.uk/expo/wp-content/uploads/eepostervr.json";

const room = AFRAME.utils.getUrlParameter('room');

console.log(room);

const eeSupervisors = [
  "Jianming Tang", // 1
  "James Wang", // 2
  "Iestyn Pierce", // 3
  "Chris Hancock", // 1
  "Noel Bristow", // 1
  "Maziar Nehzad", // 1
  "Yanhua Hong", // 1
  "Daniel Roberts", // 2
  "Mohammed Mabrook", // 3
  "Xianfeng Chen", // 2
  "Ilan Davies", // 1
  "Cristiano Palego", // 2
  "Ray Davies", // 2
  "Roger Giddings", // 2
  "Liyang Yue" // 1
];

const csSupervisors = [
  "Llyr Ap-Cenydd", // 8
  "Bill Teahan", // 6
  "Dave Perkins", // 8
  "Jonathan Roberts", // 5
  "Franck Vidal", // 6
  "Cameron Gray", // 8
  "Lucy Kuncheva", // 7
  "Panos Ritsos", // 9
  "Saad Mansoor", // 7
  "Ik Soo Lim" // 6
];

const eeRooms = {
  eea: ["Jianming Tang", "James Wang", "Iestyn Pierce", "Chris Hancock", "Noel Bristow", "Maziar Nehzad", "Yanhua Hong"],
  eeb: ["Daniel Roberts", "Mohammed Mabrook", "Xianfeng Chen", "Ilan Davies", "Cristiano Palego"],
  eec: ["Ray Davies", "Roger Giddings", "Liyang Yue"]
}

// const csRooms = [
//   "Llyr Ap-Cenydd", // 8
//   "Bill Teahan", // 6
//   "Dave Perkins", // 8
//   "Jonathan Roberts", // 5
//   "Franck Vidal", // 6
//   "Cameron Gray", // 8
//   "Lucy Kuncheva", // 7
//   "Panos Ritsos", // 9
//   "Saad Mansoor", // 7
//   "Ik Soo Lim" // 6
// ];

let expoJSONURL = null;
let degree = null;
let method = null;

if(csSupervisors.includes(room)) {
  expoJSONURL = CS_EXPO_URL;
  degree = "cs";
  method = "super";
} else if(eeRooms.hasOwnProperty(room)) {
  expoJSONURL = EE_EXPO_URL;
  degree = "ee";
  method = "group"
} else if(eeSupervisors.includes(room)) {
  expoJSONURL = EE_EXPO_URL;
  degree = "ee";
  method = "super"
} else {
  console.log("No valid supervisor");
  // No valid supervisor
}

if(room !== "" && expoJSONURL !== null) fetch(expoJSONURL).then((res) =>
  res.json().then((exhibits) => {
    const scene = document.querySelector("a-scene");
    const exhibitsEl = document.createElement("a-entity");
    exhibitsEl.setAttribute("rotation", "0 90 0");
    const roomWidth = 12;
    const roomDepth = 12;
    const roomHeight = 3;
    const exhibitHeight = 1.8;
    const wallOffset = 0.002;

    const exhibitPoses10 = [
      // Back wall
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: -roomWidth / 3,
          y: exhibitHeight,
          z: -roomDepth / 2 + wallOffset,
        }),
        rot: "0 0 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: 0,
          y: exhibitHeight,
          z: -roomDepth / 2 + wallOffset,
        }),
        rot: "0 0 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: roomWidth / 3,
          y: exhibitHeight,
          z: -roomDepth / 2 + wallOffset,
        }),
        rot: "0 0 0",
      },
      // Right Wall
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: roomWidth / 2 - wallOffset,
          y: exhibitHeight,
          z: -roomDepth / 4,
        }),
        rot: "0 -90 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: roomWidth / 2 - wallOffset,
          y: exhibitHeight,
          z: roomDepth / 4,
        }),
        rot: "0 -90 0",
      },
      // Front Wall
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: roomWidth / 3,
          y: exhibitHeight,
          z: roomDepth / 2 - wallOffset,
        }),
        rot: "0 180 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: 0,
          y: exhibitHeight,
          z: roomDepth / 2 - wallOffset,
        }),
        rot: "0 180 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: -roomWidth / 3,
          y: exhibitHeight,
          z: roomDepth / 2 - wallOffset,
        }),
        rot: "0 180 0",
      },
      // Left Wall
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: -roomWidth / 2 + wallOffset,
          y: exhibitHeight,
          z: roomDepth / 4,
        }),
        rot: "0 90 0",
      },
      {
        pos: AFRAME.utils.coordinates.stringify({
          x: -roomWidth / 2 + wallOffset,
          y: exhibitHeight,
          z: -roomDepth / 4,
        }),
        rot: "0 90 0",
      },
    ];

    const options = {
      spots: true,
    };

    if(degree === 'ee' && method === 'group') {
      const filteredExhibits = [...exhibits.filter(el => eeRooms[room].includes(el.supervisor))];

      filteredExhibits.forEach((exhibit, i) => {
        exhibitsEl.appendChild(
          createExhibit(i, exhibit, exhibitPoses10[i], options)
        );
      });
    } else {
      exhibits.filter(el => el.supervisor === room).forEach((exhibit, i) => {
        exhibitsEl.appendChild(
          createExhibit(i, exhibit, exhibitPoses10[i], options)
        );
      });
    }

    scene.appendChild(exhibitsEl);
  })
);

function createExhibit(id, exhibit, pose, options) {
  // Exhibit A-Frame Entity
  const exhibitEl = document.createElement("a-entity");
  exhibitEl.setAttribute("id", `exhibit${id}`);
  exhibitEl.setAttribute("position", pose.pos);
  exhibitEl.setAttribute("rotation", pose.rot);

  // Exhibit Frame (Plane) Entity
  const frame = document.createElement("a-plane");
  frame.setAttribute("width", exhibit.horz ? 1.5 : 1.1);
  frame.setAttribute("height", exhibit.horz ? 1.1 : 1.5);
  frame.setAttribute("color", "#252525");
  frame.setAttribute("side", "double");

  // Exhibit Image Entity
  const image = document.createElement("a-image");
  image.setAttribute("src", exhibit.posterImageURL);
  image.setAttribute("width", exhibit.horz ? 1.4 : 1);
  image.setAttribute("height", exhibit.horz ? 1 : 1.4);
  image.setAttribute("position", "0 0 0.005");

  frame.appendChild(image);

  // Exhibit Details
  const details = document.createElement("a-plane");
  details.setAttribute("width", exhibit.horz ? 1.5 : 1.1);
  details.setAttribute("height", 0.4);
  details.setAttribute("position", `0 ${exhibit.horz ? -0.775 : -0.975} 0`);
  details.setAttribute("color", "#e0e0e0");
  details.setAttribute("side", "double");

  // Exhibit Title
  const title = document.createElement("a-entity");
  title.setAttribute("position", `0 0.05 0`);
  title.setAttribute(
    "text",
    AFRAME.utils.styleParser.stringify({
      value: exhibit.projectTitle,
      align: "center",
      color: "#000000",
      baseline: "bottom",
    })
  );

  details.appendChild(title);

  // Exhibit Author
  const author = document.createElement("a-entity");
  author.setAttribute("width", 0.5);
  author.setAttribute(
    "text",
    AFRAME.utils.styleParser.stringify({
      value: exhibit.studentName,
      align: "center",
      color: "#000000",
      baseline: "top",
    })
  );

  details.appendChild(author);

  // Exhibit Supervisor
  const supervisor = document.createElement("a-entity");
  supervisor.setAttribute("position", `0 -0.08 0`);
  supervisor.setAttribute(
    "text",
    AFRAME.utils.styleParser.stringify({
      value: exhibit.supervisor,
      align: "center",
      color: "#000000",
    })
  );
  supervisor.setAttribute(
    "geometry",
    AFRAME.utils.styleParser.stringify({
      primitive: "plane",
      width: 0.8,
      height: 0.1,
    })
  );
  supervisor.setAttribute("material", "opacity: 0;");
  supervisor.setAttribute("width", 0.5);

  details.appendChild(supervisor);

  // Exhibit External Link
  const link = document.createElement("a-plane");
  link.setAttribute("width", 0.5);
  link.setAttribute("height", 0.15);
  link.setAttribute("position", `0 ${exhibit.horz ? -1.1 : -1.3} 0.05`);
  link.setAttribute("rotation", "-20 0 0");
  link.setAttribute("color", "#087df1");
  link.setAttribute("class", "interactive");
  link.setAttribute(
    "text",
    AFRAME.utils.styleParser.stringify({
      value: "VISIT POSTER PAGE",
      align: "center",
      color: "white",
      height: 0.15,
      width: 1,
    })
  );
  link.addEventListener("mouseenter", (e) =>
    e.target.setAttribute("color", "#085dc1")
  );
  link.addEventListener("mouseleave", (e) =>
    e.target.setAttribute("color", "#087df1")
  );
  link.addEventListener("click", (e) =>
    window.open(exhibit.posterWebpageURL, "_blank", "noopener,noreferrer")
  );

  // Exhibit Spotlight
  const spotlight = document.createElement("a-entity");
  const light = document.createElement("a-entity");
  light.setAttribute("position", `0 1.075 1.5`);
  light.setAttribute("rotation", "-45 0 0");
  light.setAttribute(
    "light",
    AFRAME.utils.styleParser.stringify({
      type: "spot",
      color: "#fcd76f",
      intensity: 1,
      distance: 5,
      angle: 45,
      penumbra: 0.25,
    })
  );

  // Exhibit spotlight mount
  const mount = document.createElement("a-cylinder");
  mount.setAttribute("color", "#333333");
  mount.setAttribute("radius", 0.015);
  mount.setAttribute("height", 0.1);
  mount.setAttribute("position", `0 1.15 1.5`);
  mount.setAttribute("rotation", "0 0 0");
  mount.setAttribute("segments-radial", 6);

  // Exhibit Spotlight Casing
  const casing = document.createElement("a-cylinder");
  casing.setAttribute("color", "#333333");
  casing.setAttribute("radius", 0.03);
  casing.setAttribute("height", 0.15);
  casing.setAttribute("position", `0 1.075 1.5`);
  casing.setAttribute("rotation", "45 0 0");
  casing.setAttribute("segments-radial", 6);

  spotlight.appendChild(light);
  spotlight.appendChild(mount);
  spotlight.appendChild(casing);

  exhibitEl.appendChild(frame);
  exhibitEl.appendChild(details);
  exhibitEl.appendChild(link);
  exhibitEl.appendChild(spotlight);

  return exhibitEl;
}

NAF.schemas.add({
  template: '#avatar-template',
  components: [
    'position',
    'rotation',
    {
      selector: '.head',
      component: 'material',
      property: 'color'
    }
  ]
});

// Called by Networked-Aframe when connected to server
function onConnect (e) {
  console.log("onConnect", new Date());
}

// Nav
if(!AFRAME.utils.device.isMobile()) {
  const scene = document.querySelector('a-scene');
  scene.removeAttribute('joystick');
  document.body.setAttribute('data-content', 'Use W, A, S and D keys to move around \n Click and drag the screen to move camera \n Use mouse or gaze-cursor to interact');
}