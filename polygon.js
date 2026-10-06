// Берем выделенный в Three.js Editor объект
const mesh = editor.selected;

if (mesh && mesh.isMesh) {
  // 1. Преобразуем в неиндексированную геометрию (чтобы грани не делили вершины)
  let geometry = mesh.geometry;
  if (geometry.index) {
    geometry = geometry.toNonIndexed();
    mesh.geometry = geometry;
  }

  const posAttr = geometry.attributes.position;
  const vertexCount = posAttr.count;
  const faceCount = vertexCount / 3; // Количество треугольников

  // 2. Ваша ТАБЛИЦА ЦВЕТОВ для полигонов (HEX, RGB или названия)
  // Можно вставить данные из Excel/JSON (длина массива должна соответствовать faceCount)
  const polygonColorsTable = [
    '#ff0000', // Полигон 0 (красный)
    '#00ff00', // Полигон 1 (зеленый)
    '#0000ff', // Полигон 2 (синий)
    '#ffff00', // Полигон 3 (желтый)
  ];

  const colors = new Float32Array(vertexCount * 3);
  const tempColor = new THREE.Color();

  // 3. Заполняем массив цветов: на каждый полигон идет 3 вершины
  for (let f = 0; f < faceCount; f++) {
    const colorHex = polygonColorsTable[f] || '#ffffff'; // Белый по умолчанию
    tempColor.set(colorHex);

    for (let v = 0; v < 3; v++) {
      const vertIdx = (f * 3 + v) * 3;
      colors[vertIdx]     = tempColor.r;
      colors[vertIdx + 1] = tempColor.g;
      colors[vertIdx + 2] = tempColor.b;
    }
  }

  // 4. Применяем атрибут цвета и обновляем материал
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  mesh.material.vertexColors = true;
  mesh.material.needsUpdate = true;

  // 5. Уведомляем Three.js Editor об изменениях сцены
  editor.signals.sceneGraphChanged.dispatch();
  console.log(`Полигоны успешно окрашены (${faceCount} шт.)`);
} else {
  console.error('Сначала выделите Mesh в редакторе!');
}
