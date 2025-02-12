se2433 logout
se2433 login --username admin_user --passw adminpass
se2433 healthcheck
se2433 resetpasses
se2433 healthcheck
se2433 resetstations
se2433 healthcheck
se2433 admin --addpasses --source passes33.csv
se2433 healthcheck
se2433 tollstationpasses --station AM08 --from 20220308 --to 20220322 --format json
se2433 tollstationpasses --station NAO04 --from 20220308 --to 20220322 --format csv
se2433 tollstationpasses --station NO01 --from 20220308 --to 20220322 --format csv
se2433 tollstationpasses --station OO03 --from 20220308 --to 20220322 --format csv
se2433 tollstationpasses --station XXX --from 20220308 --to 20220322 --format csv
se2433 tollstationpasses --station OO03 --from 20220308 --to 20220322 --format YYY
se2433 errorparam --station OO03 --from 20220308 --to 20220322 --format csv
se2433 tollstationpasses --station AM08 --from 20220309 --to 20220320 --format json
se2433 tollstationpasses --station NAO04 --from 20220309 --to 20220320 --format csv
se2433 tollstationpasses --station NO01 --from 20220309 --to 20220320 --format csv
se2433 tollstationpasses --station OO03 --from 20220309 --to 20220320 --format csv
se2433 tollstationpasses --station XXX --from 20220309 --to 20220320 --format csv
se2433 tollstationpasses --station OO03 --from 20220309 --to 20220320 --format YYY
se2433 passanalysis --stationop AM --tagop NAO --from 20220308 --to 20220322 --format json
se2433 passanalysis --stationop NAO --tagop AM --from 20220308 --to 20220322 --format csv
se2433 passanalysis --stationop NO --tagop OO --from 20220308 --to 20220322 --format csv
se2433 passanalysis --stationop OO --tagop KO --from 20220308 --to 20220322 --format csv
se2433 passanalysis --stationop XXX --tagop KO --from 20220308 --to 20220322 --format csv
se2433 passanalysis --stationop AM --tagop NAO --from 20220309 --to 20220320 --format json
se2433 passanalysis --stationop NAO --tagop AM --from 20220309 --to 20220320 --format csv
se2433 passanalysis --stationop NO --tagop OO --from 20220309 --to 20220320 --format csv
se2433 passanalysis --stationop OO --tagop KO --from 20220309 --to 20220320 --format csv
se2433 passanalysis --stationop XXX --tagop KO --from 20220309 --to 20220320 --format csv
se2433 passescost --stationop AM --tagop NAO --from 20220308 --to 20220322 --format json
se2433 passescost --stationop NAO --tagop AM --from 20220308 --to 20220322 --format csv
se2433 passescost --stationop NO --tagop OO --from 20220308 --to 20220322 --format csv
se2433 passescost --stationop OO --tagop KO --from 20220308 --to 20220322 --format csv
se2433 passescost --stationop XXX --tagop KO --from 20220308 --to 20220322 --format csv
se2433 passescost --stationop AM --tagop NAO --from 20220309 --to 20220320 --format json
se2433 passescost --stationop NAO --tagop AM --from 20220309 --to 20220320 --format csv
se2433 passescost --stationop NO --tagop OO --from 20220309 --to 20220320 --format csv
se2433 passescost --stationop OO --tagop KO --from 20220309 --to 20220320 --format csv
se2433 passescost --stationop XXX --tagop KO --from 20220309 --to 20220320 --format csv
se2433 chargesby --opid NAO --from 20220308 --to 20220322 --format json
se2433 chargesby --opid GE --from 20220308 --to 20220322 --format csv
se2433 chargesby --opid OO --from 20220308 --to 20220322 --format csv
se2433 chargesby --opid KO --from 20220308 --to 20220322 --format csv
se2433 chargesby --opid NO --from 20220308 --to 20220322 --format csv
se2433 chargesby --opid NAO --from 20220309 --to 20220320 --format json
se2433 chargesby --opid GE --from 20220309 --to 20220320 --format csv
se2433 chargesby --opid OO --from 20220309 --to 20220320 --format csv
se2433 chargesby --opid KO --from 20220309 --to 20220320 --format csv
se2433 chargesby --opid NO --from 20220309 --to 20220320 --format csv