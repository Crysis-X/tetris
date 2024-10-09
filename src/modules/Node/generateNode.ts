export const NodeList = {
    cube: 0,
    pistolRight: 1,
    pistolLeft: 2,
    line: 3,
    thunderLeft: 4,
    thunderRight: 5,
    mountain: 6,
  };
export type Nodes = keyof typeof NodeList;
type Result = {
    [K in Nodes]?: Array<{x: number, y: number}>;
}
type OtherResults = {
    [key: string]: Array<{x: number, y: number}>;
}
export default function generateNode(type: Nodes, x: number, y: number): Result & OtherResults {
    switch (NodeList[type]) {
        case 0:
            return {
                cube: [
                    {y, x},
                    {y, x: x + 1},
                    {y: y + 1, x},
                    {y: y + 1, x: x + 1}
                ]
            };
        case 1:
            return {
                pistolRight: [
                    {y, x: x - 1},
                    {y, x: x},
                    {y, x: x + 1},
                    {y: y + 1, x: x + 1}
                ],
                r1_pistolRight: [
                    {y: y - 1, x},
                    {y, x},
                    {y: y + 1, x},
                    {y: y + 1, x: x - 1}
                ],
                r2_pistolRight: [
                    {y, x: x + 1},
                    {y, x},
                    {y, x: x - 1},
                    {y: y - 1, x: x - 1}
                ],
                r3_pistolRight: [
                    {y: y + 1, x},
                    {y, x},
                    {y: y - 1, x},
                    {y: y - 1, x: x + 1},
                ]
            }
        case 2:
            return {
                pistolLeft: [
                    {y, x: x + 1},
                    {y, x},
                    {y, x: x - 1},
                    {y: y + 1, x: x - 1},
                ],
                r1_pistolLeft: [
                    {y: y + 1, x},
                    {y, x},
                    {y: y - 1, x},
                    {y: y - 1, x: x - 1},
                ],
                r2_pistolLeft: [
                    {y, x: x - 1},
                    {y, x},
                    {y, x: x + 1},
                    {y: y - 1, x: x + 1},
                ],
                r3_pistolLeft: [
                    {y: y - 1, x},
                    {y, x},
                    {y: y + 1, x},
                    {y: y + 1, x: x + 1},
                ]
            }
        case 3:
            return {
                line: [
                    {y, x: x - 1},
                    {y, x: x},
                    {y, x: x + 1},
                    {y, x: x + 2},
                ],
                r1_line: [
                    {y: y - 1, x},
                    {y, x},
                    {y: y + 1, x},
                    {y: y + 2, x},
                ]
            }
        case 4:
            return {
                thunderLeft: [
                    {y: y - 1, x},
                    {y, x},
                    {y, x: x - 1},
                    {y: y + 1, x: x - 1},
                ],
                r1_thunderLeft: [
                    {y, x: x - 1},
                    {y, x},
                    {y: y + 1, x},
                    {y: y + 1, x: x + 1},
                ]
            }
        case 5:
            return {
                thunderRight: [
                    {y: y - 1, x},
                    {y, x},
                    {y, x: x + 1},
                    {y: y + 1, x: x + 1},
                ],
                r1_thunderRight: [
                    {y, x: x - 1},
                    {y, x},
                    {y: y - 1, x},
                    {y: y - 1, x: x + 1},
                ]
            }
        default:
          return {
            mountain: [
                {y: y - 1, x},
                {y, x},
                {y, x: x - 1},
                {y, x: x + 1},
            ],
            r1_mountain: [
                {y: y - 1, x},
                {y, x},
                {y, x: x + 1},
                {y: y + 1, x},
            ],
            r2_mountain: [
                {y, x: x - 1},
                {y, x},
                {y: y + 1, x},
                {y, x: x + 1},
            ],
            r3_mountain: [
                {y: y - 1, x},
                {y, x},
                {y, x: x - 1},
                {y: y + 1, x},
            ]
          }
      }
}