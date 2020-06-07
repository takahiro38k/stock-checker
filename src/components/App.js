import React, { useEffect, useReducer } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import _ from 'lodash'

// combineReducersをreducerとしてimport
import reducer from '../reducers'
import AppContext from '../contexts/AppContext'
import ResponsiveDrawer from './ResponsiveDrawer'
import Items from './Items'
import Preferences from './Preferences'
import Manual from './Manual'
import categoriesJson from './resources/categories.json'

export const APP_KEY = 'StockCheckerKey078SDU84S1'
export const { categories: defaultCategories } = categoriesJson
const defaultState = {
  items: [],
  categories: defaultCategories,
  /**
   * mailAdressプロパティは、nullやundefinedだとエラーとなるため''を設定。
   * 使用するPreferenceMailAddressForm.jsにおいて、<textarea>(multilineの
   * <TextField>)で表示する際、nullだとWarningが発生。
   * また、同ファイルにおけるvalidationでmatch()を実行する際、nullやundefinedは
   * TypeErrorとなる。
   */
  preferences: {mailAdress: '', autoMail: false}
}

const App = () => {
  const appState = localStorage.getItem(APP_KEY)
  const initialState = appState ? JSON.parse(appState) : defaultState
  /*
  useReducer(reducer, initialArg[, init])
  ++++----------------
  1st arg   reducer
  2nd arg   stateの初期値
  3rd arg   stateの初期化時に発火するcallback
  return    [state, dispatch]
  ----------------++++
   */
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    /**
     * オブジェクトの比較のため、データ内容が一致しても===ではtrueにならない。
     * よってLodashのisEqual()でチェック。
     * https://lodash.com/docs#isEqual
     */
    // stateがdefaultの場合を除き、stateが変更されるたびlocalStorageにstateを保存する。
    if (!_.isEqual(state, defaultState)) {
        // JSON.stringify()
        // 引数に渡したJSオブジェクトをJSON形式の文字列に変換
        localStorage.setItem(APP_KEY, JSON.stringify(state))
      }
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        {/* ResponsiveDrawerコンポーネントでwrapすることで、
            内部コンテンツをprops.childrenとして取得し、
            ResponsiveDrawer.jsで指定箇所に埋めこむ。 */}
        <ResponsiveDrawer>
          <Switch>
            <Route path="/" exact>
              <Items />
            </Route>
            <Route path="/preferences" exact>
              <Preferences />
            </Route>
            <Route path="/Manual" exact>
              <Manual />
            </Route>
            {/* URLがヒットしないときにNot Found画面を表示 */}
            <Route>
              <p>指定のページは見つかりませんでした。</p>
            </Route>
          </Switch>
        </ResponsiveDrawer>
      </Router>
    </AppContext.Provider>
  )
}

export default App

