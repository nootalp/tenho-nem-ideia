import { Gnisi } from "./utils/paket/classGnisi"
import { Kelas } from "./utils/paket/classKelas";
import { Setting } from "./utils/paket/classSetting"
import * as conf from './utils/config'

const kelas = new Kelas(conf.main_Scope, conf.router_Scope)
const gnisi = new Gnisi(conf.router_Scope)
const setting = new Setting(conf.http_Host, conf.http_Port, conf.main_Scope)

kelas.setRoutes()
gnisi.upRoutes()
setting.stepLog()