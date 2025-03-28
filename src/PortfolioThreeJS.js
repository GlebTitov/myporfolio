// PortfolioThreeJS.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import anime from 'animejs';

class PortfolioThreeJS {
    constructor() {
        // Основные свойства
        this.scenes = {};
        this.cameras = {};
        this.renderers = {};
        this.animationFrames = {};
        this.objects = {
            background: [],
            profile: null,
            projects: [],
            character: null
        };
        this.mixers = {};
        this.clock = new THREE.Clock();
        this.hoveredObject = null;
        this.selectedObject = null;
        this.eventListeners = {};
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
    }

    // Инициализация фоновой сцены
    initBackgroundScene(container) {
        // Настройка сцены
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Сохраняем объекты в классе
        this.scenes.background = scene;
        this.cameras.background = camera;
        this.renderers.background = renderer;

        // Создание разнообразных 3D объектов
        this._createBackgroundObjects(scene);

        // Позиционирование камеры
        camera.position.z = 5;

        // Настройка обработчика изменения размера окна
        this._setupBackgroundResizeHandler();

        // Запуск анимации
        this._animateBackground();

        return this;
    }

    // Создание объектов фона
    _createBackgroundObjects(scene) {
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.DodecahedronGeometry(1, 0)
        ];

        const materials = [
            new THREE.MeshPhongMaterial({
                color: 0x2194ce,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            }),
            new THREE.MeshPhongMaterial({
                color: 0x21ce93,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            }),
            new THREE.MeshPhongMaterial({
                color: 0xce2179,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            })
        ];

        // Создаем объекты
        for (let i = 0; i < 20; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 30;
            mesh.position.y = (Math.random() - 0.5) * 30;
            mesh.position.z = (Math.random() - 0.5) * 15 - 10;
            mesh.scale.setScalar(Math.random() * 0.8 + 0.6);
            mesh.userData = {
                rotationSpeed: {
                    x: Math.random() * 0.01 - 0.005,
                    y: Math.random() * 0.01 - 0.005,
                    z: Math.random() * 0.01 - 0.005
                },
                movementAmplitude: Math.random() * 0.05 + 0.02,
                movementFrequency: Math.random() * 0.002 + 0.001,
                phase: Math.random() * Math.PI * 2
            };

            this.objects.background.push(mesh);
            scene.add(mesh);
        }

        // Добавляем освещение
        const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
        light1.position.set(1, 1, 5);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0x8080ff, 0.5);
        light2.position.set(-1, -1, 5);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
    }

    // Настройка обработчика изменения размера для фона
    _setupBackgroundResizeHandler() {
        const handleResize = () => {
            const camera = this.cameras.background;
            const renderer = this.renderers.background;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        this.eventListeners.backgroundResize = handleResize;
    }

    // Анимация фоновых объектов
    _animateBackground() {
        const scene = this.scenes.background;
        const camera = this.cameras.background;
        const renderer = this.renderers.background;

        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.animationFrames.background = animationId;

            this.objects.background.forEach(child => {
                const userData = child.userData;

                // Вращение
                child.rotation.x += userData.rotationSpeed.x;
                child.rotation.y += userData.rotationSpeed.y;
                child.rotation.z += userData.rotationSpeed.z;

                // Колебательное движение
                const time = Date.now() * userData.movementFrequency;
                child.position.y += Math.sin(time + userData.phase) * userData.movementAmplitude;
                child.position.x += Math.sin(time * 0.8 + userData.phase) * userData.movementAmplitude * 0.5;
            });

            renderer.render(scene, camera);
        };

        animate();
    }

    // Инициализация 3D визуализации профиля
    initProfileVisualization(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        // Установка размера
        const size = Math.min(container.clientWidth, 300);
        renderer.setSize(size, size);
        container.appendChild(renderer.domElement);

        // Сохраняем объекты
        this.scenes.profile = scene;
        this.cameras.profile = camera;
        this.renderers.profile = renderer;

        // Позиционирование камеры
        camera.position.z = 5;

        // Создание сферы с модифицированной геометрией
        const profileMesh = this._createProfileMesh();
        this.objects.profile = profileMesh;
        scene.add(profileMesh);

        // Добавляем освещение
        this._addLightsToScene(scene);

        // Запуск анимации
        this._animateProfile();

        return this;
    }

    // Создание сетки профиля с модифицированной геометрией
    _createProfileMesh() {
        const geometry = new THREE.SphereGeometry(2, 32, 32);

        // Модификация геометрии
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);
            const z = geometry.attributes.position.getZ(i);

            const noise = 0.2 * Math.sin(5 * x) * Math.sin(5 * y) * Math.sin(5 * z);

            geometry.attributes.position.setX(i, x * (1 + noise));
            geometry.attributes.position.setY(i, y * (1 + noise));
            geometry.attributes.position.setZ(i, z * (1 + noise));
        }

        geometry.computeVertexNormals();

        // Создание материала
        const material = new THREE.MeshPhongMaterial({
            color: 0x2194ce,
            specular: 0x555555,
            shininess: 30,
            wireframe: false,
            transparent: true,
            opacity: 0.9
        });

        return new THREE.Mesh(geometry, material);
    }

    // Анимация профиля
    _animateProfile() {
        const scene = this.scenes.profile;
        const camera = this.cameras.profile;
        const renderer = this.renderers.profile;
        const sphere = this.objects.profile;

        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.animationFrames.profile = animationId;

            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }

    // Инициализация 3D предпросмотра проектов
    initProjectsShowcase(container, projects) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Сохраняем объекты
        this.scenes.projects = scene;
        this.cameras.projects = camera;
        this.renderers.projects = renderer;

        // Позиционирование камеры
        camera.position.z = 5;

        // Создание проектных объектов
        this._createProjectObjects(scene, projects);

        // Добавляем освещение
        this._addLightsToScene(scene);

        // Настройка обработчиков событий
        this._setupProjectEventHandlers(container, renderer);

        // Настройка обработчика изменения размера
        this._setupProjectsResizeHandler(container);

        // Запуск анимации
        this._animateProjects();

        return this;
    }

    // Создание 3D объектов для проектов
    _createProjectObjects(scene, projects) {
        const projectObjects = [];
        const textures = [
            { color: 0x3498db },  // Синий
            { color: 0x2ecc71 },  // Зеленый
            { color: 0xe74c3c }   // Красный
        ];

        projects.forEach((project, index) => {
            // Создаем геометрию
            const geometry = new THREE.BoxGeometry(2.5, 1.6, 0.2);

            // Создаем материал
            const material = new THREE.MeshPhongMaterial({
                color: textures[index % textures.length].color,
                specular: 0xffffff,
                shininess: 100,
                emissive: 0x111111,
                transparent: true,
                opacity: 0.9
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (index - 1) * 3.2;
            mesh.userData = {
                title: project.title,
                index,
                description: project.description,
                link: project.link,
                originalPosition: mesh.position.clone(),
                originalRotation: mesh.rotation.clone(),
                hoverState: false
            };

            // Добавляем текст
            const textGeometry = new THREE.PlaneGeometry(2, 0.5);
            const textCanvas = document.createElement('canvas');
            textCanvas.width = 512;
            textCanvas.height = 128;
            const context = textCanvas.getContext('2d');
            context.fillStyle = 'white';
            context.font = 'bold 36px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(project.title, 256, 64);

            const textTexture = new THREE.Texture(textCanvas);
            textTexture.needsUpdate = true;

            const textMaterial = new THREE.MeshBasicMaterial({
                map: textTexture,
                transparent: true
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.z = 0.11;
            textMesh.position.y = -0.5;

            mesh.add(textMesh);

            projectObjects.push(mesh);
            scene.add(mesh);
        });

        this.objects.projects = projectObjects;
    }

    // Добавление освещения к сцене
    _addLightsToScene(scene) {
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(0, 0, 5);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
    }

    // Настройка обработчиков событий для проектов
    _setupProjectEventHandlers(container, renderer) {
        // Обработка кликов
        const handleClick = (event) => {
            if (this.hoveredObject) {
                this.selectedObject = this.hoveredObject;

                // Анимация выбранного проекта
                anime({
                    targets: this.hoveredObject.position,
                    y: this.hoveredObject.position.y + 0.2,
                    duration: 300,
                    easing: 'easeOutQuad'
                });

                // Генерируем пользовательское событие для обработки в компоненте
                const customEvent = new CustomEvent('project-selected', {
                    detail: this.hoveredObject.userData
                });
                container.dispatchEvent(customEvent);
            }
        };

        // Обработка движения мыши
        const handleMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();

            // Проверяем, находится ли мышь в пределах рендерера
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                // Вычисляем нормализованные координаты мыши
                this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                // Обновляем рейкастер с позицией мыши
                this.raycaster.setFromCamera(this.mouse, this.cameras.projects);

                // Проверяем пересечения
                const intersects = this.raycaster.intersectObjects(this.objects.projects, true);

                if (intersects.length > 0) {
                    // Получаем родительский объект, если попали в дочерний
                    let hitObject = intersects[0].object;

                    // Если попали в дочерний (текстовую сетку), получаем его родителя
                    while (hitObject.parent && this.objects.projects.indexOf(hitObject) === -1) {
                        hitObject = hitObject.parent;
                    }

                    // Обрабатываем только если это один из наших проектных объектов
                    if (this.objects.projects.includes(hitObject)) {
                        if (this.hoveredObject !== hitObject) {
                            // Сбрасываем предыдущее состояние наведения
                            if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
                                this.resetProjectHover(this.hoveredObject);
                            }

                            // Устанавливаем новое состояние наведения
                            this.hoveredObject = hitObject;
                            this.setProjectHover(this.hoveredObject);
                        }
                    }
                } else {
                    // Нет пересечений - сбрасываем наведение если нужно
                    if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
                        this.resetProjectHover(this.hoveredObject);
                        this.hoveredObject = null;
                    }
                }
            } else {
                // Мышь за пределами рендерера - сбрасываем наведение если нужно
                if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
                    this.resetProjectHover(this.hoveredObject);
                    this.hoveredObject = null;
                }
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('mousemove', handleMouseMove);

        this.eventListeners.projectClick = handleClick;
        this.eventListeners.projectMouseMove = handleMouseMove;
    }

    // Настройка обработчика изменения размера для проектов
    _setupProjectsResizeHandler(container) {
        const handleResize = () => {
            const camera = this.cameras.projects;
            const renderer = this.renderers.projects;

            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);
        this.eventListeners.projectsResize = handleResize;
    }

    // Анимация проектов
    _animateProjects() {
        const scene = this.scenes.projects;
        const camera = this.cameras.projects;
        const renderer = this.renderers.projects;

        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.animationFrames.projects = animationId;

            this.objects.projects.forEach(mesh => {
                if (!mesh.userData.hoverState && mesh !== this.selectedObject) {
                    mesh.rotation.y = Math.sin(Date.now() * 0.001 + mesh.userData.index * 0.5) * 0.15;
                    mesh.position.y = mesh.userData.originalPosition.y + Math.sin(Date.now() * 0.002 + mesh.userData.index) * 0.05;
                }
            });

            renderer.render(scene, camera);
        };

        animate();
    }

    // Применение эффекта наведения к проекту
    setProjectHover(object) {
        object.userData.hoverState = true;

        // Анимируем эффект наведения
        anime({
            targets: object.position,
            y: object.userData.originalPosition.y + 0.3,
            z: object.userData.originalPosition.z + 0.5,
            duration: 300,
            easing: 'easeOutQuad'
        });

        anime({
            targets: object.rotation,
            y: 0,
            duration: 300,
            easing: 'easeOutQuad'
        });

        // Изменяем материал для эффекта наведения
        object.material.emissive.set(0x333333);
        object.material.needsUpdate = true;
    }

    // Сброс эффекта наведения
    resetProjectHover(object) {
        object.userData.hoverState = false;

        // Восстанавливаем позицию
        anime({
            targets: object.position,
            y: object.userData.originalPosition.y,
            z: object.userData.originalPosition.z,
            duration: 300,
            easing: 'easeOutQuad'
        });

        // Восстанавливаем материал
        object.material.emissive.set(0x111111);
        object.material.needsUpdate = true;
    }

    // Создание частиц для интро
    createParticles(container) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        container.appendChild(particlesContainer);

        const particlesCount = 50;

        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const size = Math.random() * 5 + 2;
            const duration = Math.random() * 20 + 10;

            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(particle);
        }

        // Добавляем обработчик движения мыши для интерактивности
        const handleMouseMove = (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            document.documentElement.style.setProperty('--mouse-x', mouseX);
            document.documentElement.style.setProperty('--mouse-y', mouseY);
        };

        container.addEventListener('mousemove', handleMouseMove);
        this.eventListeners.particlesMouseMove = handleMouseMove;

        return particlesContainer;
    }

    // Анимация появления заголовка и подзаголовка
    animateIntro(elements) {
        const { title, subtitle, aboutIntro, scrollIndicator } = elements;

        // Создаем анимацию с помощью Anime.js
        const timeline = anime.timeline({
            easing: 'easeOutExpo'
        });

        timeline
            .add({
                targets: title,
                opacity: [0, 1],
                translateY: [70, 0],
                rotateX: [90, 0],
                duration: 1500
            })
            .add({
                targets: subtitle,
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1200,
                offset: '-=1000'
            })
            .add({
                targets: aboutIntro,
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 1200,
                offset: '-=800'
            })
            .add({
                targets: scrollIndicator,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                offset: '-=600'
            });

        // Эффект печатающегося текста для подзаголовка
        const subtitleText = "Фронтенд-разработчик и 3D-энтузиаст";
        subtitle.innerHTML = "";
        let i = 0;

        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (i < subtitleText.length) {
                    subtitle.innerHTML += subtitleText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 500);
    }

    // Анимация списка навыков
    animateSkillsList(skillsList) {
        anime({
            targets: skillsList.children,
            translateX: [50, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }

    // Добавление 3D модели Ferrari в интро
// Исправленный метод addCarToIntro без временной модели
    addCarToIntro(container) {
        // Создаем сцену для автомобиля
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth / 2, container.clientHeight / 2);
        renderer.setClearColor(0x000000, 0); // Полностью прозрачный фон
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;

        // Позиционируем контейнер для модели
        const carContainer = document.createElement('div');
        carContainer.className = 'car-container';
        carContainer.style.position = 'absolute';
        carContainer.style.left = '23%';
        carContainer.style.bottom = '10%';
        carContainer.style.zIndex = '1';

        carContainer.appendChild(renderer.domElement);
        container.appendChild(carContainer);

        // Позиционируем камеру для лучшего обзора при вращении
        camera.position.set(3, 1.5, -3);
        camera.lookAt(0, 0.5, 0);

        // Настраиваем окружение
        scene.fog = null; // Убираем туман

        // Добавляем освещение для автомобиля
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-5, 5, -5);
        scene.add(directionalLight2);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 10, 0);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        scene.add(spotLight);

        // Материалы
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            metalness: 1.0,
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03
        });

        const detailsMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.5
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.25,
            roughness: 0,
            transmission: 1.0
        });

        // Подготавливаем DRACO загрузчик
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        // Загружаем модель Ferrari
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        // Массив для колес
        const wheels = [];

        // Добавляем прелоадер или индикатор загрузки вместо временной модели
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'car-loading';
        loadingDiv.textContent = 'Загрузка модели...';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.color = 'white';
        carContainer.appendChild(loadingDiv);

        loader.load(
            'https://threejs.org/examples/models/gltf/ferrari.glb', // URL из примера
            (gltf) => {
                // Удаляем индикатор загрузки
                if (loadingDiv.parentNode) {
                    loadingDiv.parentNode.removeChild(loadingDiv);
                }

                const carModel = gltf.scene.children[0];

                // Применяем материалы
                carModel.getObjectByName('body').material = bodyMaterial;

                carModel.getObjectByName('rim_fl').material = detailsMaterial;
                carModel.getObjectByName('rim_fr').material = detailsMaterial;
                carModel.getObjectByName('rim_rr').material = detailsMaterial;
                carModel.getObjectByName('rim_rl').material = detailsMaterial;
                carModel.getObjectByName('trim').material = detailsMaterial;

                carModel.getObjectByName('glass').material = glassMaterial;

                // Добавляем колеса в массив для анимации
                wheels.push(
                    carModel.getObjectByName('wheel_fl'),
                    carModel.getObjectByName('wheel_fr'),
                    carModel.getObjectByName('wheel_rl'),
                    carModel.getObjectByName('wheel_rr')
                );

                // Масштабируем и позиционируем модель
                carModel.scale.set(0.8, 0.8, 0.8);
                carModel.position.set(0, 0, 0);

                // Добавляем модель на сцену
                scene.add(carModel);
                this.objects.character = carModel;

                // Сохраняем колеса для анимации
                this.objects.wheels = wheels;

                // Создаем группу для вращения всей модели
                const rotationGroup = new THREE.Group();
                scene.add(rotationGroup);
                rotationGroup.add(carModel);
                this.objects.rotationGroup = rotationGroup;
            },
            (xhr) => {
                const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
                loadingDiv.textContent = `Загрузка модели: ${percentComplete}%`;
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened during Ferrari model loading:', error);
                // В случае ошибки загрузки GLTF модели, создаем запасную модель
                loadingDiv.textContent = 'Не удалось загрузить модель';
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                    this.createSimpleCar(scene);
                }, 1000);
            }
        );

        // Сохраняем объекты
        this.scenes.character = scene;
        this.cameras.character = camera;
        this.renderers.character = renderer;

        // Настраиваем обработчик изменения размера
        const handleResize = () => {
            const width = container.clientWidth / 2;
            const height = container.clientHeight / 2;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        this.eventListeners.characterResize = handleResize;

        // Анимация модели
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.animationFrames.character = animationId;

            const time = -performance.now() / 1000;

            // Вращаем колеса, если они есть
            if (this.objects.wheels) {
                for (let i = 0; i < this.objects.wheels.length; i++) {
                    this.objects.wheels[i].rotation.x = time * Math.PI * 2;
                }
            }

            // Вращаем всю модель вокруг своей оси, если загружен Ferrari
            if (this.objects.rotationGroup) {
                this.objects.rotationGroup.rotation.y += 0.005; // Медленное вращение всей модели
            }
            // Вращаем модель, если загружена запасная
            else if (this.objects.character) {
                this.objects.character.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        };

        animate();

        return carContainer;
    }
    // Создание простой модели автомобиля (запасной вариант)
    createSimpleCar(scene) {
        // Создаем группу для всей модели
        const carGroup = new THREE.Group();

        // Кузов автомобиля
        const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Красный цвет
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        // Крыша
        const roofGeometry = new THREE.BoxGeometry(2, 1, 1.8);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.5;
        roof.position.x = -0.5;
        carGroup.add(roof);

        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 24);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

        // Переднее левое колесо
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.position.set(1.5, 0, -1);
        carGroup.add(wheelFL);

        // Переднее правое колесо
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.position.set(1.5, 0, 1);
        carGroup.add(wheelFR);

        // Заднее левое колесо
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.position.set(-1.5, 0, -1);
        carGroup.add(wheelRL);

        // Заднее правое колесо
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.position.set(-1.5, 0, 1);
        carGroup.add(wheelRR);

        // Фары
        const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const headlightMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });

        // Левая фара
        const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightL.position.set(2, 0.5, -0.6);
        carGroup.add(headlightL);

        // Правая фара
        const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlightR.position.set(2, 0.5, 0.6);
        carGroup.add(headlightR);

        // Добавляем свет от фар
        const lightL = new THREE.PointLight(0xffffcc, 0.5, 3);
        lightL.position.set(2.2, 0.5, -0.6);
        carGroup.add(lightL);

        const lightR = new THREE.PointLight(0xffffcc, 0.5, 3);
        lightR.position.set(2.2, 0.5, 0.6);
        carGroup.add(lightR);

        // Добавляем лобовое стекло
        const windshieldGeometry = new THREE.PlaneGeometry(1.5, 1);
        const windshieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x8888ff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(0.6, 1.2, 0);
        windshield.rotation.y = Math.PI / 2;
        windshield.rotation.z = -0.2;
        carGroup.add(windshield);

        // Добавляем модель на сцену
        scene.add(carGroup);
        this.objects.character = carGroup;

        return carGroup;
    }

    // Очистка ресурсов и удаление обработчиков событий
    dispose() {
        // Отмена анимационных фреймов
        Object.values(this.animationFrames).forEach(id => {
            cancelAnimationFrame(id);
        });

        // Удаление обработчиков событий
        for (const [key, handler] of Object.entries(this.eventListeners)) {
            window.removeEventListener(key.replace('project', '').toLowerCase(), handler);
        }

        // Удаление рендереров и их DOM-элементов
        Object.values(this.renderers).forEach(renderer => {
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            renderer.dispose();
        });

        // Очистка геометрий и материалов
        const disposeObject = (obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(material => material.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        };

        // Очистка объектов фона
        this.objects.background.forEach(disposeObject);

        // Очистка профиля
        if (this.objects.profile) disposeObject(this.objects.profile);

        // Очистка проектов
        this.objects.projects.forEach(disposeObject);

        // Очистка персонажа, если есть
        if (this.objects.character) {
            // Для сложных моделей удаляем со сцены
            if (this.scenes.character) {
                this.scenes.character.remove(this.objects.character);
            }
            this.objects.character = null;
        }

        // Очистка микшеров анимаций
        this.mixers = {};

        // Очистка сцен
        Object.values(this.scenes).forEach(scene => {
            scene.clear();
        });

        // Сброс массивов и объектов
        this.objects.background = [];
        this.objects.projects = [];
        this.objects.profile = null;
        this.hoveredObject = null;
        this.selectedObject = null;
    }
}

export default PortfolioThreeJS;