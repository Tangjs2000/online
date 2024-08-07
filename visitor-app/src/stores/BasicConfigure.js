/* 在线客服基础配置信息 */
import axios from "axios";

const Basic = {
    title: "在线客服title",
    logo: "/unit/minio/download?filename=logo.png",
    file_resource_configuration: {
        // word: "<svg viewBox=\"0 0 1024 1024\" width=\"200\" height=\"200\"><path d=\"M529.821261 0h68.274694v214.336783h81.03857c3.251176-42.506115-15.292568-110.058325 36.124177-127.397931 71.52587-8.669802 144.496707-0.842897 216.745061-3.973659 28.417686 2.649106 64.78269-7.104421 86.095955 18.062088a181.825024 181.825024 0 0 1 5.418626 53.70461v488.037629a216.745061 216.745061 0 0 1-7.104421 64.782691c-34.920038 12.041392-72.248354 5.900282-108.372531 6.984007-1.806209 54.306679 4.455315 109.456256-3.732831 163.28128-9.753528 27.815616-41.783631 26.491063-65.143933 27.213546H597.373471V1023.518344h-70.562558C351.367827 991.006585 175.5635 960.662277 0 928.752587V95.367827C176.526811 63.578551 353.29445 32.270931 529.821261 0z\" fill=\"#0071C5\" p-id=\"18145\"></path><path d=\"M734.524929 122.581373c84.289746-7.706491 169.663217-1.565381 254.555033-3.492003v547.642521h-80.4365V237.57667C854.938852 193.264346 781.727187 174.841016 734.524929 122.581373z\" fill=\"#FFFFFF\" p-id=\"18146\"></path><path d=\"M597.975541 250.099718h264.91063v619.047977h-264.91063v-71.405456h195.672625v-48.165569H597.975541V689.971778h195.672625v-48.165569H597.975541v-59.604892h195.672625v-48.165569H597.975541v-60.206962h195.672625V309.584196H597.975541c-0.120414-19.868297-0.120414-39.616181 0-59.484478zM407.480715 341.373471H172.553151a36.124177 36.124177 0 0 0-36.124176 36.124177v269.245532a36.124177 36.124177 0 0 0 36.124176 36.124177h234.927564a36.124177 36.124177 0 0 0 36.124177-36.124177V377.25682a36.124177 36.124177 0 0 0-36.124177-35.883349z m-201.211665 71.044215h90.792098a15.172154 15.172154 0 0 1 0 30.344308h-90.792098a15.172154 15.172154 0 0 1 0-30.344308z m165.569144 200.12794H206.26905a15.172154 15.172154 0 0 1 0-30.344309h165.569144a15.172154 15.172154 0 0 1 0 30.344309z m0-84.289746H206.26905a15.172154 15.172154 0 0 1 0-30.344309h165.569144a15.172154 15.172154 0 0 1 0 30.344309z\" fill=\"#FFFFFF\" p-id=\"18147\"></path></svg>"
        svg: {
            // txt: "<svg viewBox=\"0 0 1024 1024\" ><path d=\"M192 0h448.1536L960 320v576c0 70.6944-57.3056 128-128 128H192C121.3056 1024 64 966.6944 64 896V128C64 57.3056 121.3056 0 192 0z\" fill=\"#2696FF\" p-id=\"1543\"></path><path d=\"M417.7536 546.176h-60.8256v170.5728h-40.9216V546.176H256V512h161.7536v34.176z m94.3872 36.416L549.376 512h47.0528l-57.8304 101.5296 59.328 103.2192h-47.6032l-38.1824-71.7184-38.1952 71.7184h-47.6032l59.3408-103.2192L427.8528 512h47.0528l37.2352 70.592zM768 546.176h-60.8256v170.5728H666.24V546.176h-60.0064V512H768v34.176z\" fill=\"#FFFFFF\" opacity=\".9\" p-id=\"1544\"></path><path d=\"M640 0l320 320H768c-70.6944 0-128-57.3056-128-128V0z\" fill=\"#8FC6FE\" p-id=\"1545\"></path></svg>",
            // pdf:"<svg viewBox=\"0 0 1024 1024\" p-id=\"2780\"><path d=\"M616.746667 85.333333L896 347.904V853.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h403.413334z m244.352 295.381334L581.802667 118.186667v177.237333a85.333333 85.333333 0 0 0 85.333333 85.333333h193.962667zM232.746667 512v224.810667h28.074666v-102.570667h14.378667c27.648 0 46.933333-1.109333 57.813333-3.242667 10.88-2.133333 20.053333-5.845333 27.605334-11.093333 7.509333-5.162667 13.269333-11.776 17.28-19.754667 4.053333-7.978667 6.058667-17.024 6.058666-27.050666s-2.048-19.029333-6.186666-27.008a56.661333 56.661333 0 0 0-17.152-19.968 65.962667 65.962667 0 0 0-24.021334-11.050667C327.893333 513.024 309.589333 512 281.728 512H232.746667z m28.074666 96.725333v-70.912h39.210667c36.565333 0 54.869333 11.648 54.869333 34.986667a33.28 33.28 0 0 1-11.946666 26.112c-7.936 6.954667-22.912 10.24-44.885334 9.813333h-37.248zM426.112 512v224.810667h77.056c32 0 56.32-4.778667 73.002667-14.293334 16.64-9.514667 29.525333-22.741333 38.570666-39.637333 9.002667-16.853333 13.525333-34.858667 13.525334-53.888 0-19.029333-3.029333-35.84-9.130667-50.346667a100.864 100.864 0 0 0-26.282667-36.992 108.330667 108.330667 0 0 0-40.661333-22.442666c-15.701333-4.821333-40.746667-7.210667-75.136-7.210667H426.112z m27.093333 199.594667v-173.781334h14.378667c26.794667 0 47.36 1.28 61.738667 3.84 14.378667 2.56 26.88 7.68 37.546666 15.36s18.901333 17.578667 24.661334 29.781334c5.76 12.16 8.661333 25.429333 8.661333 39.765333 0 14.336-2.432 26.965333-7.338667 37.930667a74.282667 74.282667 0 0 1-21.418666 27.733333c-9.386667 7.594667-20.352 12.714667-32.981334 15.36-12.629333 2.688-32.768 4.010667-60.416 4.010667h-24.832z m338.048-82.901334v-26.112h-94.037333v-64.469333h94.037333V512h-122.154666v224.810667h28.117333v-108.117334h94.037333z\" fill=\"#EA5454\" p-id=\"2781\"></path></svg>",
            // pdf:"<svg t=\"1711899387856\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4691\" ><path d=\"M981.333333 276.053333V981.333333a42.666667 42.666667 0 0 1-42.666666 42.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V42.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h619.946667z\" fill=\"#FC5A5A\" p-id=\"4692\"></path><path d=\"M705.28 233.386667V0L981.333333 276.053333H747.946667a42.666667 42.666667 0 0 1-42.666667-42.666666z\" fill=\"#FD9796\" p-id=\"4693\"></path><path d=\"M252.586667 715.52H224A10.666667 10.666667 0 0 1 213.333333 704V490.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h62.293333q95.786667-1.28 95.786667 72.746667-2.56 69.12-81.706667 72.96h-37.12V704a10.666667 10.666667 0 0 1-10.666666 11.52z m10.666666-196.906667v66.56q3.84 0 15.36 1.28c33.92 3.413333 50.56-8.106667 49.706667-34.56 0-23.04-16.426667-34.133333-49.706667-33.28a34.986667 34.986667 0 0 1-15.36 0zM417.493333 704V490.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h69.76c78.506667 0 117.973333 40.533333 119.04 118.826667s-40.533333 117.546667-119.04 117.546666h-69.76a10.666667 10.666667 0 0 1-10.666667-12.373333z m49.706667-186.24v157.44h26.88q70.4 2.56 69.12-78.08t-69.12-79.36zM697.813333 715.52h-28.586666a10.666667 10.666667 0 0 1-10.666667-10.666667V490.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h130.773333a10.666667 10.666667 0 0 1 10.666667 10.666667v18.133333a10.666667 10.666667 0 0 1-10.666667 10.666667h-91.52V576h85.333333a10.666667 10.666667 0 0 1 10.666667 10.666667v18.346666a10.666667 10.666667 0 0 1-10.666667 10.666667h-85.333333V704a10.666667 10.666667 0 0 1-10.666667 11.52z\" fill=\"#FFFFFF\" p-id=\"4694\"></path></svg>",
            // pdf: "<svg t=\"1711899464956\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4859\"><path d=\"M590.222222 79.644444L859.022222 347.943822V881.777778c0 37.700267-30.5664 68.266667-68.266666 68.266666H233.244444c-37.700267 0-68.266667-30.5664-68.266666-68.266666V147.911111c0-37.700267 30.5664-68.266667 68.266666-68.266667h356.977778z m-11.764622 28.444445H233.244444a39.822222 39.822222 0 0 0-39.799466 38.456889L193.422222 147.911111v733.866667a39.822222 39.822222 0 0 0 38.456889 39.799466L233.244444 921.6h557.511112a39.822222 39.822222 0 0 0 39.799466-38.456889L830.577778 881.777778V359.742578L578.4576 108.088889z\" fill=\"#FF7875\" p-id=\"4860\"></path><path d=\"M854.755556 376.337067h-215.1424c-45.528178 0-82.551467-36.431644-83.5072-81.737956l-0.017067-1.792V79.644444h28.444444v213.162667c0 29.895111 23.819378 54.232178 53.515378 55.062756l1.564445 0.022755h215.1424v28.444445z\" fill=\"#FF7875\" p-id=\"4861\"></path><path d=\"M56.888889 494.933333m28.444444 0l853.333334 0q28.444444 0 28.444444 28.444445l0 284.444444q0 28.444444-28.444444 28.444445l-853.333334 0q-28.444444 0-28.444444-28.444445l0-284.444444q0-28.444444 28.444444-28.444445Z\" fill=\"#FF7875\" p-id=\"4862\"></path><path d=\"M318.435556 762.311111v-63.232h22.272c40.448 0 75.264-19.968 75.264-65.28 0-47.104-34.56-62.208-76.288-62.208H272.611556V762.311111h45.824z m19.968-99.328h-19.968v-55.04h18.688c22.016 0 34.304 6.656 34.304 25.856 0 18.688-10.752 29.184-33.024 29.184zM505.827556 762.311111c55.552 0 93.952-29.952 93.952-96.256 0-66.304-38.4-94.464-96.512-94.464h-54.784V762.311111h57.344z m-5.376-36.864h-6.144v-117.248h6.144c30.72 0 52.48 12.544 52.48 57.856s-21.76 59.392-52.48 59.392z m180.48 36.864v-72.704h65.024v-38.144h-65.024v-41.728h75.776v-38.144H635.107556V762.311111h45.824z\" fill=\"#FFFFFF\" p-id=\"4863\"></path></svg>",
            // word: "<svg viewBox=\"0 0 1024 1024\"><path d=\"M791.94 155.36H332.48c-42.23 0-76.54 34.31-76.54 76.54v76.55h-51.03c-28.16 0-51.04 22.87-51.04 51.03v306.37c0 28.15 22.88 51.02 51.04 51.02h51.03v76.54c0 42.24 34.32 76.55 76.54 76.55h459.46c42.23 0 76.54-34.32 76.54-76.54V231.9c0.1-42.24-34.31-76.54-76.54-76.54z m-547.68 298.6h40.28l26.04 93.58h5.7l29.16-93.58h34.45l29.02 93.71h6.24l26.18-93.71h40.41l-40.41 133.72H384.1l-19.53-70.25h-5.43l-19.26 69.98h-55.74l-39.88-133.45zM817.45 793.5c-0.01 14.09-11.42 25.5-25.51 25.51H332.48c-14.09-0.01-25.5-11.43-25.51-25.51v-76.54h204.21c28.15 0 51.03-22.88 51.03-51.03V614.9H740.9c14.09-0.01 25.51-11.43 25.52-25.52-0.02-14.09-11.43-25.5-25.52-25.51H562.21v-51.03H740.9c14.09-0.01 25.51-11.43 25.52-25.52-0.01-14.09-11.43-25.5-25.52-25.52H562.21v-51.03H740.9c14.09-0.01 25.51-11.43 25.52-25.51-0.01-14.09-11.43-25.51-25.52-25.52H562.21c0-28.16-22.89-51.03-51.03-51.03H306.97v-76.54c0.01-14.09 11.43-25.5 25.51-25.52h459.46c14.08 0.01 25.5 11.43 25.51 25.52V793.5z m0 0\"/></svg>",
            word: "<svg t=\"1711900026752\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"13675\" ><path d=\"M901.632 926.72c0 12.8-5.12 25.088-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.304V48.64c0-12.8 5.12-25.6 14.336-34.304C144.896 5.12 157.696 0 170.496 0h418.816c12.8 0 25.6 5.12 34.816 14.336l263.68 263.68c9.216 9.216 14.336 21.504 14.336 34.816V926.72z\" fill=\"#EBECF0\" p-id=\"13676\"></path><path d=\"M901.632 926.72v48.64c0 12.8-5.12 25.6-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-27.136 0-48.64-22.016-48.64-48.64V926.72c0 12.8 5.12 25.088 14.336 34.304 9.216 9.216 21.504 14.336 34.304 14.336h682.496c27.136 0 48.64-22.016 48.64-48.64z\" fill=\"#C1C7D0\" p-id=\"13677\"></path><path d=\"M24.064 536.576h975.36v243.712c0 27.136-22.016 48.64-48.64 48.64H73.216c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.816v-243.2z\" fill=\"#003771\" p-id=\"13678\"></path><path d=\"M121.856 536.576V438.784L24.064 536.576h97.792z m779.776 0l1.024-97.792 97.28 97.792h-98.304z\" fill=\"#00213F\" p-id=\"13679\"></path><path d=\"M901.632 312.832v6.656h-263.68c-27.136 0-48.64-22.016-48.64-48.64V0c12.8 0 25.6 5.12 34.816 14.336l264.192 263.68c8.704 9.216 13.824 21.504 13.312 34.816z\" fill=\"#C1C7D0\" p-id=\"13680\"></path><path d=\"M296.448 769.536H215.552v-188.928h83.456c65.024 0.512 97.792 30.72 98.816 90.624-0.512 65.024-33.792 98.304-101.376 98.304zM276.992 624.64v100.864h13.312c29.696 0 44.032-16.896 44.032-51.2 2.048-35.84-12.8-52.224-45.056-49.152h-12.288zM511.488 574.976c62.464 2.56 95.744 35.84 99.84 98.816-2.56 62.976-35.84 95.744-99.84 98.816-63.488-2.048-96.768-35.328-98.816-99.84 3.584-61.44 36.352-94.208 98.816-97.792z m0 46.592c-23.552 0.512-35.84 17.92-36.864 52.224 1.536 35.84 13.824 53.76 36.864 54.272 24.576-0.512 37.376-18.944 37.888-54.272-1.024-34.816-13.824-52.224-37.888-52.224zM816.64 652.288h-58.368c-2.56-19.968-13.824-30.208-33.792-30.72-22.528 0.512-34.304 18.944-34.816 55.296 0 34.304 12.288 51.2 36.864 51.2 18.432 0 29.184-10.752 31.744-31.744h59.392c-6.656 48.64-36.864 74.24-90.624 76.288-64.512-2.048-97.792-34.816-99.84-97.792 3.584-62.464 34.816-95.744 94.72-99.84 57.344 1.024 88.576 26.624 94.72 77.312z\" fill=\"#FFFFFF\" p-id=\"13681\"></path></svg>",
            pdf: "<svg t=\"1711900062905\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"13846\" ><path d=\"M901.63125 926.725c0 12.8-5.125 25.0875-14.3375 34.3-9.225 9.2125-21.5 14.3375-34.3125 14.3375H170.49375c-12.8 0-25.6-5.125-34.3-14.3375-9.2125-9.225-14.3375-21.5-14.3375-34.3V48.6375c0-12.8 5.1125-25.6 14.3375-34.3C144.89375 5.125 157.70625 0 170.49375 0H589.31875c12.8 0 25.6 5.125 34.8125 14.3375l263.675 263.6875c9.2125 9.2125 14.3375 21.5 14.3375 34.8125v613.8875h-0.5125z\" fill=\"#EBECF0\" p-id=\"13847\"></path><path d=\"M901.63125 926.725v48.6375c0 12.8-5.125 25.6-14.3375 34.3-9.225 9.225-21.5 14.3375-34.3125 14.3375H170.49375c-27.1375 0-48.6375-22.0125-48.6375-48.6375v-48.6375c0 12.8 5.1125 25.0875 14.3375 34.3 9.2125 9.2125 21.5 14.3375 34.3 14.3375h682.5c27.1375 0 48.6375-22.0125 48.6375-48.6375z\" fill=\"#C1C7D0\" p-id=\"13848\"></path><path d=\"M121.85625 536.575v-97.8L24.06875 536.575h97.7875z m779.775 0l1.025-97.8 97.275 97.8h-98.3z\" fill=\"#D30000\" p-id=\"13849\"></path><path d=\"M901.63125 312.8375v6.65H637.94375c-27.1375 0-48.6375-22.0125-48.6375-48.6375V0c12.8 0 25.6 5.125 34.8125 14.3375L888.31875 278.025c8.7 9.2125 13.825 21.5 13.3125 34.8125z\" fill=\"#C1C7D0\" p-id=\"13850\"></path><path d=\"M502.93125 611.1125H462.81875v142.9875h39.4c44.75 0 68.9375-25.2125 68.9375-73.85 0-42.325-22.125-68.575-68.225-69.1375zM274.95625 611.1875H217.56875v60.7625h57.3875c23.5125 0 38.375-8.0625 38.375-30.7875 0-18.525-11.3875-29.975-38.375-29.975z\" fill=\"#FF1D1D\" p-id=\"13851\"></path><path d=\"M24.58125 536.575v243.2c0 13.3125 5.1125 25.6 14.3375 34.8125 8.7 9.225 21.5 14.3375 34.3 14.3375h877.575c26.625 0 48.6375-21.5 48.6375-48.6375V536.575H24.58125z m254.675 178.475H217.56875v82.075h-55.8v-228.75h118.3625c53.1875 0 88.55 26.8875 88.55 71.9s-33.3125 74.775-89.425 74.775z m230.275 82.075h-102.225v-228.75h103.4c77.075 0 119.25 50.025 119.25 110.375 0 73.225-53.85 118.375-120.425 118.375z m354.3375-184.5875H731.13125v52.025h123.8125v44.4875h-123.8125v88.0625h-55.5125v-228.75h188.25v44.1625z\" fill=\"#FF1D1D\" p-id=\"13852\"></path><path d=\"M280.11875 568.375h-118.35v228.75h55.8v-82.075h61.6875c56.1125 0 89.425-28 89.425-74.775s-35.3625-71.9-88.55-71.9z m-5.175 103.575h-57.3875v-60.7625h57.3875c26.9875 0 38.375 11.45 38.375 29.975 0 22.7125-14.875 30.7875-38.375 30.7875zM510.70625 568.375h-103.4v228.75h102.225c66.575 0 120.425-45.15 120.425-118.375 0-60.35-42.1625-110.375-119.25-110.375z m-8.5 185.725h-39.4V611.1125h40.1125c46.0875 0.575 68.225 26.825 68.225 69.1375 0 48.6375-24.1875 73.85-68.9375 73.85zM675.61875 797.125h55.5125v-88.0625h123.8125v-44.4875h-123.8125v-52.025h132.7375V568.375h-188.25v228.75z\" fill=\"#FFFFFF\" p-id=\"13853\"></path></svg>",
            txt: "<svg t=\"1711900173779\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14016\" ><path d=\"M901.632 926.72c0 12.8-5.12 25.088-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.304V48.64c0-12.8 5.12-25.6 14.336-34.304C144.896 5.12 157.696 0 170.496 0h418.816c12.8 0 25.6 5.12 34.816 14.336l263.68 263.68c9.216 9.216 14.336 21.504 14.336 34.816V926.72z\" fill=\"#EBECF0\" p-id=\"14017\"></path><path d=\"M901.632 926.72v48.64c0 12.8-5.12 25.6-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-27.136 0-48.64-22.016-48.64-48.64V926.72c0 12.8 5.12 25.088 14.336 34.304 9.216 9.216 21.504 14.336 34.304 14.336h682.496c27.136 0 48.64-22.016 48.64-48.64z\" fill=\"#C1C7D0\" p-id=\"14018\"></path><path d=\"M24.064 536.576h975.36v243.712c0 27.136-22.016 48.64-48.64 48.64H73.216c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.816v-243.2z\" fill=\"#A8A1A0\" p-id=\"14019\"></path><path d=\"M121.856 536.576V438.784L24.064 536.576h97.792z m779.776 0l1.024-97.792 97.28 97.792h-98.304z\" fill=\"#777777\" p-id=\"14020\"></path><path d=\"M901.632 312.832v6.656h-263.68c-27.136 0-48.64-22.016-48.64-48.64V0c12.8 0 25.6 5.12 34.816 14.336l264.192 263.68c8.704 9.216 13.824 21.504 13.312 34.816z\" fill=\"#C1C7D0\" p-id=\"14021\"></path><path d=\"M228.864 629.76v-49.152h173.568v49.152H347.136v139.776H284.16V629.76H228.864zM512.512 715.776l-30.72 53.248H411.648l66.56-98.816-60.416-90.624h69.632l26.624 48.128 27.648-48.128h70.144L547.328 670.72l64.512 98.816h-70.144l-29.184-53.76zM622.592 629.76v-49.152h173.568v49.152h-55.296v139.776h-62.464V629.76h-55.808z\" fill=\"#FFFFFF\" p-id=\"14022\"></path></svg>",
            excel: "<svg t=\"1711900217573\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14187\" ><path d=\"M901.851653 926.484607a48.255937 48.255937 0 0 1-14.274541 34.442195 48.844737 48.844737 0 0 1-34.457555 14.279661H170.419644a48.220097 48.220097 0 0 1-34.457555-14.279661 48.844737 48.844737 0 0 1-14.279662-34.442195V48.846068a48.317377 48.317377 0 0 1 14.279662-34.467795A48.844737 48.844737 0 0 1 170.419644 0.001331h418.800096a48.742337 48.742337 0 0 1 34.662355 14.131182l263.858857 263.910057a48.844737 48.844737 0 0 1 14.110701 34.667475z\" fill=\"#EBECF0\" p-id=\"14188\"></path><path d=\"M901.851653 926.484607v48.767936a48.317377 48.317377 0 0 1-14.274541 34.467796 48.844737 48.844737 0 0 1-34.457555 14.279661H170.419644a48.844737 48.844737 0 0 1-48.788417-48.844737v-48.721856a48.204737 48.204737 0 0 0 14.279662 34.442195 48.844737 48.844737 0 0 0 34.457555 14.279661h682.648713a48.844737 48.844737 0 0 0 48.773056-48.783296z\" fill=\"#C1C7D0\" p-id=\"14189\"></path><path d=\"M24.167034 536.423034h975.153932v243.849923a48.921536 48.921536 0 0 1-48.721856 48.844736H73.011771a48.342977 48.342977 0 0 1-34.467796-14.274541 48.844737 48.844737 0 0 1-14.376941-34.570195z\" fill=\"#0AC905\" p-id=\"14190\"></path><path d=\"M121.733627 536.412794V438.856441L24.167034 536.412794z m780.118026 0l0.926719-97.556353 97.039234 97.556353z\" fill=\"#168E2D\" p-id=\"14191\"></path><path d=\"M901.851653 312.628125v6.860791h-263.833257a48.844737 48.844737 0 0 1-48.844736-48.844737V0.001331a48.732097 48.732097 0 0 1 34.662355 14.115822l264.268456 263.751337a49.459136 49.459136 0 0 1 13.701102 34.754515z\" fill=\"#C1C7D0\" p-id=\"14192\"></path><path d=\"M265.190721 764.037458H136.346088v-153.94284h126.335836v35.978193H187.382182v21.749732h63.590317v35.973073h-63.590317v24.268769h77.808539zM358.05716 720.532875l-25.098207 43.504583H276.065587l54.384569-80.322456-49.366976-73.620384h56.893366l21.754852 39.321549 22.589411-39.321549h56.888246L386.508963 683.725242l52.705212 80.317336H382.320809zM599.843726 668.662222h-47.682498q-3.353596-24.268768-27.612124-25.103327-27.612124 0.839679-28.446683 45.178821 0 41.845706 30.120921 41.830345 22.584291 0 25.937886-25.932766h48.522177q-8.376309 59.417523-73.625505 61.91096-78.648218-2.508797-81.151894-79.482777 4.177915-76.124061 76.96886-81.151894 69.43735 0.839679 76.96886 62.750638zM752.112328 764.037458h-128.844633v-153.94284h126.335836v35.978193H674.303789v21.749732h63.590317v35.973073H674.303789v24.268769h77.808539zM897.694219 764.037458H777.215655v-153.94284h51.036094v117.964647h69.44247z\" fill=\"#FFFFFF\" p-id=\"14193\"></path></svg>",
            ppt: "<svg t=\"1711900371194\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"15312\" ><path d=\"M901.632 926.72c0 12.8-5.12 25.088-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.304V48.64c0-12.8 5.12-25.6 14.336-34.304C144.896 5.12 157.696 0 170.496 0h418.816c12.8 0 25.6 5.12 34.816 14.336l263.68 263.68c9.216 9.216 14.336 21.504 14.336 34.816V926.72z\" fill=\"#EBECF0\" p-id=\"15313\"></path><path d=\"M901.632 926.72v48.64c0 12.8-5.12 25.6-14.336 34.304-9.216 9.216-21.504 14.336-34.304 14.336H170.496c-27.136 0-48.64-22.016-48.64-48.64V926.72c0 12.8 5.12 25.088 14.336 34.304 9.216 9.216 21.504 14.336 34.304 14.336h682.496c27.136 0 48.64-22.016 48.64-48.64z\" fill=\"#C1C7D0\" p-id=\"15314\"></path><path d=\"M24.064 536.576h975.36v243.712c0 27.136-22.016 48.64-48.64 48.64H73.216c-12.8 0-25.6-5.12-34.304-14.336-9.216-9.216-14.336-21.504-14.336-34.816v-243.2z\" fill=\"#ED7911\" p-id=\"15315\"></path><path d=\"M121.856 536.576V438.784L24.064 536.576h97.792z m779.776 0l1.024-97.792 97.28 97.792h-98.304z\" fill=\"#BC5406\" p-id=\"15316\"></path><path d=\"M901.632 312.832v6.656h-263.68c-27.136 0-48.64-22.016-48.64-48.64V0c12.8 0 25.6 5.12 34.816 14.336l264.192 263.68c8.704 9.216 13.824 21.504 13.312 34.816z\" fill=\"#C1C7D0\" p-id=\"15317\"></path><path d=\"M319.488 769.536H238.08v-188.928h83.456c65.024 0.512 97.792 30.72 98.816 90.624-0.512 65.024-33.792 98.304-100.864 98.304zM299.52 624.64v100.864h13.312c29.696 0 44.032-16.896 44.032-51.2 2.048-35.84-12.8-52.224-45.056-49.152h-12.288zM502.272 769.536H440.32v-188.928h90.624c52.736 0.512 79.872 22.016 81.408 63.488-0.512 44.032-27.136 66.048-79.36 66.56h-30.72v58.88z m0-102.912h25.6c16.384 0 24.576-7.68 24.576-22.528 0-12.8-10.752-19.456-32.768-19.456h-17.408v41.984zM622.592 629.76v-49.152h173.568v49.152h-55.296v139.776h-62.464V629.76h-55.808z\" fill=\"#FFFFFF\" p-id=\"15318\"></path></svg>",
            zip: "<svg t=\"1711900255087\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14354\" ><path d=\"M901.63125 926.725c0 12.8-5.125 25.0875-14.3375 34.3-9.225 9.2125-21.5 14.3375-34.3125 14.3375H170.49375c-12.8 0-25.6-5.125-34.3-14.3375-9.2125-9.225-14.3375-21.5-14.3375-34.3V48.6375c0-12.8 5.1125-25.6 14.3375-34.3C144.89375 5.125 157.70625 0 170.49375 0H589.31875c12.8 0 25.6 5.125 34.8125 14.3375l263.675 263.6875c9.2125 9.2125 14.3375 21.5 14.3375 34.8125v613.8875h-0.5125z\" fill=\"#EBECF0\" p-id=\"14355\"></path><path d=\"M901.63125 926.725v48.6375c0 12.8-5.125 25.6-14.3375 34.3-9.225 9.225-21.5 14.3375-34.3125 14.3375H170.49375c-27.1375 0-48.6375-22.0125-48.6375-48.6375v-48.6375c0 12.8 5.1125 25.0875 14.3375 34.3 9.2125 9.2125 21.5 14.3375 34.3 14.3375h682.5c27.1375 0 48.6375-22.0125 48.6375-48.6375z\" fill=\"#C1C7D0\" p-id=\"14356\"></path><path d=\"M121.85625 536.575v-97.8L24.06875 536.575h97.7875z m779.775 0l1.025-97.8 97.275 97.8h-98.3z\" fill=\"#D3AB05\" p-id=\"14357\"></path><path d=\"M901.63125 312.8375v6.65H637.94375c-27.1375 0-48.6375-22.0125-48.6375-48.6375V0c12.8 0 25.6 5.125 34.8125 14.3375L888.31875 278.025c8.7 9.2125 13.825 21.5 13.3125 34.8125z\" fill=\"#C1C7D0\" p-id=\"14358\"></path><path d=\"M24.58125 536.575v243.2c0 13.3125 5.1125 25.6 14.3375 34.8125 8.7 9.225 21.5 14.3375 34.3 14.3375h877.575c26.625 0 48.6375-21.5 48.6375-48.6375V536.575H24.58125z m404.4375 262.85H205.90625v-45.4125l126.7875-130.875h-120.6375v-51.975h212.9v50.2375l-124.325 126.05h136.3625l-7.975 51.975z m114.0125 0h-74.275V571.1625h74.275v228.2625z m182.275-77.4375h-54.775v77.4375h-73.9125V571.1625h128.375c54.875 0 93.1 27.3125 93.1 74.4125s-36.0375 76.4125-92.8125 76.4125z\" fill=\"#EDC314\" p-id=\"14359\"></path><path d=\"M713.44375 621.125h-42.9125v50.6875h42.9125c20.0375 0 31.625-8.125 31.625-25.6125 0-14.6-8.8125-25.075-31.625-25.075z\" fill=\"#EDC314\" p-id=\"14360\"></path><path d=\"M424.95625 621.4v-50.2375H212.05625v51.9875h120.6375l-126.7875 130.875v45.4h223.1125l7.975-51.975H300.63125l124.325-126.05zM468.75625 571.1625h74.275v228.2625h-74.275zM725.00625 571.1625h-128.375v228.2625h73.9125v-77.4375H725.31875c56.775 0 92.8125-27.875 92.8125-76.4125s-38.2375-74.4125-93.1-74.4125z m-11.5625 100.65h-42.9125V621.125h42.9125c22.825 0 31.625 10.4875 31.625 25.075 0 17.4875-11.6 25.6125-31.625 25.6125z\" fill=\"#FFFFFF\" p-id=\"14361\"></path></svg>",
            none: "<svg t=\"1711985634677\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1496\" ><path d=\"M332.3904 710.4a12.8 12.8 0 0 0 12.8 12.8h458.3296a12.8 12.8 0 1 0 0-25.6H345.1904a12.8 12.8 0 0 0-12.8 12.8z m471.1424 128H345.1904a12.8 12.8 0 1 0 0 25.6h458.3296a12.8 12.8 0 1 0 0-25.6z m142.9888-643.9808L776.5632 26.2656A77.0176 77.0176 0 0 0 718.6688 0H259.456a77.4144 77.4144 0 0 0-77.1456 77.4912v200.576H96a38.4 38.4 0 0 0-38.4 38.4v192a38.4 38.4 0 0 0 38.4 38.4h86.3104v399.6416A77.4144 77.4144 0 0 0 259.456 1024h629.76A77.4144 77.4144 0 0 0 966.4 946.5088v-700.16a78.08 78.08 0 0 0-19.8912-51.9296zM147.4304 474.4832l-7.9232-14.336a145.6128 145.6128 0 0 0 70.6176-49.792H146.7136v-15.0144h69.8752v-20.48H161.1136v-15.0144h55.4752V335.36h13.696c4.7872 0.9216 5.0432 2.7264 0.7168 5.4656v19.0976h54.0416v15.0144h-54.0416v20.48h70.6176v15.0144h-64.128a129.3568 129.3568 0 0 0 69.12 45.7088l-5.0432 16.3712a131.4176 131.4176 0 0 1-70.6176-49.1264v64.1408h-14.3616v-62.0928a148.48 148.48 0 0 1-69.1712 49.0496zM940.8 946.5088A51.776 51.776 0 0 1 889.2544 998.4H259.456a51.776 51.776 0 0 1-51.5456-51.8912V546.8672h330.112a38.4 38.4 0 0 0 38.4-38.4v-192a38.4 38.4 0 0 0-38.4-38.4h-330.112V77.4912A51.776 51.776 0 0 1 259.456 25.6h459.2128c0.9856 0 1.9456 0.256 2.9184 0.32v183.3216A40.256 40.256 0 0 0 761.728 249.6H940.8v696.9088zM408.2304 359.8592v12.9664h-27.3664v27.9808h36.0064v12.9536h-36.0064a110.144 110.144 0 0 1-1.4464 17.7408 238.0032 238.0032 0 0 1 36.032 32l-10.0864 12.9664q-20.1728-23.8848-29.5424-33.4336a80.0768 80.0768 0 0 1-36.736 41.6128l-10.0864-12.2752a59.6992 59.6992 0 0 0 37.4656-58.6752H328.96v-12.9536h37.4656v-27.9808H357.12a71.9104 71.9104 0 0 1-18.0096 21.8368l-10.816-10.24a90.7264 90.7264 0 0 0 30.2592-50.4832l14.4128 4.0832c2.88 1.3824 2.1632 2.7392-2.1632 4.1088a134.9632 134.9632 0 0 1-7.9232 17.728h45.3888z m29.5424 107.1104V480h-14.4128v-124.8512h59.072v122.8032h-14.4v-10.9184H437.76z m30.2592-98.9184H437.76v85.9648h30.2592v-85.9648z\" fill=\"#A8A8A8\" p-id=\"1497\"></path></svg>",
            download_option: "<svg viewBox=\"0 0 1024 1024\" width=\"35\" height=\"35\"><path d=\"M768 351.9h-34.3a224 224 0 0 0-443.4 0H256a192 192 0 0 0 0 384h32a32 32 0 0 0 0-64h-32a128 128 0 0 1 0-256H320a32 32 0 0 0 32-32 160 160 0 0 1 320 0 32 32 0 0 0 32 32h64a128 128 0 0 1 0 256h-32a32 32 0 1 0 0 64h32a192 192 0 0 0 0-384z\" fill=\"#8a8a8a\" p-id=\"21007\"></path><path d=\"M602.5 696.3l-58.6 58.6V480A32 32 0 0 0 480 480v274.7l-58.4-58.4a32 32 0 0 0-45.3 45.3l113.1 113.1a31.9 31.9 0 0 0 45.2 0l113.2-113.1a32 32 0 0 0-45.3-45.3z\" fill=\"#8a8a8a\"/></svg>"
        }
    }
}


/**
 * 初始化项目配置
 */
const init = function () {
}


export {Basic}








