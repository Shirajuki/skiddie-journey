/*
2: [1, 0], // Floor top
a: [2, 1], // Wall left
b: [0, 1], // Wall right
c: [3, 1], // Corner bottom-left
d: [4, 1], // Corner bottom-right
e: [3, 0], // Corner top-left
f: [4, 0], // Corner top-right
8: [1, 2], // Floor bottom
g: [0, 0], // Swing top-left
h: [2, 0], // Swing top-right
i: [0, 2], // Swing bottom-left
j: [2, 2], // Swing bottom-right
x: [2, 3], // PC1
y: [2, 4], // PC2
z: [2, 5], // PC3
X: [3, 3], // PC4
Y: [3, 4], // PC5
Z: [3, 5], // PC6
*/
const map = `a000000000000000000000000000000000000000000000000000000000000000000000000000000000000b
a000000000000000010000010000000000000000000000000000000000000000000000000000000000000b
a000000000000000010000010000000000000000000000000000000000000000000000000000000000000b
a000000000000000010000010000000000000000000000000000000000000000000000000000000000000b
a000000000000000010000010000000000000000000000000000000000000000000000000000000000000b
a000000000000000010000010000000000000000000000000000000000000000000000000000000000000b
a000000000000000222222222000000000000000000000000000000000000000000000000000000000000b
a000000000000000200000002000000000000000000000000000000000000000000000000000000000000b
a000000000000000200000004000000000000000000000000000000000000000000000000000000000000b
a000000000000000200xyz00400000000000000xyz0000000000000000000000000000000000000000000b
a000000000000000200XYZ00400000000000000XYZ0000000000000000000000000000000000000000000b
a000000000000000222222222333333300g222222222h0000000000000000000000000000000000000000b
a000000000000000000000000000000000000000000000000000000000000000000000000000000000000b
a00000000000000000000000000000000000000000000000g2h0000000000000000000000000000000000b
a000000000000000000000000000000000000000000000000000000000000000000000000000000000000b
a0000000000000000000000000000000000000000000000000000g2h00000000000000000000000000000b
a000000000000000000000000000000000000000000000000000000000000000000000000000000000000b
a000000000000000000000000000000000000000000000000000000000g2h000000000000000000000000b
a000000000000000000000000000000000000000000000000000000000000000000000000000000000000b
a00000000000000000000000000000000000000000000000000000000000000g2h0000000000000000000b
a000000000000000000000000000000000000000000000000000000000000000000000000000000000002b
a000000000000000000000000000000000000000000000000000000000g2h000000000000000000000002b
a000000000000000000000xyz00000000000000000000000000000000000000000000xyz0000000000002b
a000000000000000000000XYZ00000000000000xyz00000000000g2h0000000000000XYZ0000000000002b
a00000000000000000g22222222222h00000000XYZ0000000000000000000000g22222222h00000000002b
c222222222h0000000b11111111111c222222222222222222h00000000000000b11111111222222222222d
1111111111c2222222d111111111111111111111111111111a00000000000000b111111111111111111111
1111111111111111111111111111111111111111111111111c2h000000000000b111111111111111111111
111111111111111111111111111111111111111111111111111a000000000000b111111111111111111111
111111111111111111111111111111111111111111111111111c2h000000xyz0b111111111111111111111
11111111111111111111111111111111111111111111111111111a000000XYZ0b111111111111111111111
11111111111111111111111111111111111111111111111111111c2222222222d111111111111111111111
11111111111111111111111111111111111111111111111111111111111111111111111111111111111111
11111111111111111111111111111111111111111111111111111111111111111111111111111111111111`;
